import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as process from 'process';
import { WsTicketMessageDto } from './dto/ws-ticket-message.dto';
import { WsTicketReadDto } from './dto/ws-ticket-read.dto';
import { BaseGateway } from "../base-gateway";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway(+process.env.SOCKET_PORT || 3001, {
	namespace: 'ticket',
	cors: { origin: '*' },
})
export class TicketGateway extends BaseGateway {
	constructor(jwtService: JwtService) {
		super(jwtService);
	}
	protected getNamespace(): string {
		return 'TICKETS';
	}

	// Присоединение к чату
	@SubscribeMessage('joinChat')
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { ticketId: number },
	): Promise<WsResponse<any>> {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const ticketId = data.ticketId.toString();
		client.join(ticketId);
		console.log(`Client joined to chat: Account = ${accountId}, Ticket = ${ticketId}`);
		return { event: 'joinChat', data: { socketClient: client.id, accountId, ticketId: ticketId } };
	}

	// Покинуть чат
	@SubscribeMessage('leaveChat')
	async handleLeaveRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { ticketId: number },
	): Promise<WsResponse<any>> {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const ticketId = data.ticketId.toString();
		client.leave(ticketId);
		console.log(`Client left the chat: Account = ${accountId}, Ticket = ${ticketId}`);
		return { event: 'leaveChat', data: { socketClient: client.id, accountId, ticketId: ticketId } };
	}

	// Начать печатать
	@SubscribeMessage('startTyping')
	async handleStartTyping(@MessageBody() data: { ticketId: number }, @ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const ticketId = data.ticketId.toString();
		this.updateUserStatus(this.typingUsers, { ticketId: data.ticketId, userId: accountId }, 'add');
		this.server.to(ticketId).emit('userTyping', { ...data, userId: accountId });
		console.log(`User started typing: Account=${accountId}, Ticket=${data.ticketId}`);
		return { event: 'userTyping', data: { ...data, userId: accountId } };
	}

	// Перестать печатать
	@SubscribeMessage('stopTyping')
	async handleStopTyping(@MessageBody() data: { ticketId: number }, @ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const ticketId = data.ticketId.toString();
		this.updateUserStatus(this.typingUsers, { ticketId: data.ticketId, userId: accountId }, 'remove');
		this.server.to(ticketId).emit('userStopTyping', { ...data, userId: accountId });
		console.log(`User stopped typing: Account=${accountId}, Ticket=${data.ticketId}`);
		return { event: 'userStopTyping', data: { ...data, userId: accountId } };
	}

	// Отправить сообщение
	@SubscribeMessage('sendMessage')
	async handleSyncMessage(@MessageBody() data: WsTicketMessageDto, @ConnectedSocket() client?: Socket) {
		if (client) {
			const accountId = await this.validateClient(client);
			if (!accountId || accountId !== data.senderId) return;
		}

		const ticketId = data.ticketId.toString();
		this.server.to(ticketId).emit('syncMessage', data);
		console.log(`Message sent: Ticket=${data.ticketId}, UserType=${data.userType}, Sender=${data.senderId}`);
		return { event: 'syncMessage', data, client };
	}

	// Прочитать сообщения
	@SubscribeMessage('readChat')
	async handleReadChat(@MessageBody() data: WsTicketReadDto, @ConnectedSocket() client?: Socket) {
		if (client) {
			const accountId = await this.validateClient(client);
			if (!accountId) return;
		}

		const ticketId = data.ticketId.toString();
		this.server.to(ticketId).emit('syncReadStatus', data);
		console.log(`Message read: Ticket=${data.ticketId}, Reader=${data.userType}`);
		return { event: 'syncReadStatus', data };
	}

	private updateUserStatus(
		map: Map<string, Set<string>>,
		data: { ticketId: number; userId: number },
		action: 'add' | 'remove',
	): void {
		const userId = data.userId.toString();
		const ticketId = data.ticketId.toString();

		if (!map.has(ticketId)) {
			map.set(ticketId, new Set());
		}

		const userSet = map.get(ticketId)!;
		if (action === 'add') {
			userSet.add(userId);
		} else {
			userSet.delete(userId);
			if (userSet.size === 0) {
				map.delete(ticketId);
			}
		}
	}
}
