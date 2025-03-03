import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as process from 'process';
import { WsChatMessageDto } from './dto/ws-chat-message.dto';
import { WsChatReadDto } from './dto/ws-chat-read.dto';
import { BaseGateway } from "../base-gateway";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway(+process.env.SOCKET_PORT || 3001, {
	namespace: 'chat',
	cors: { origin: '*' },
})
export class ChatGateway extends BaseGateway {
	constructor(jwtService: JwtService) {
		super(jwtService);
	}
	protected getNamespace(): string {
		return 'CHAT';
	}

	// Присоединение к чату
	@SubscribeMessage('joinChat')
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chatId: number },
	): Promise<WsResponse<any>> {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const chatId = data.chatId.toString();
		client.join(chatId);
		console.log(`Client joined to chat: Account = ${accountId}, Chat = ${chatId}`);
		return { event: 'joinChat', data: { socketClient: client.id, accountId, chatId: chatId } };
	}

	// Покинуть чат
	@SubscribeMessage('leaveChat')
	async handleLeaveRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chatId: number },
	): Promise<WsResponse<any>> {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const chatId = data.chatId.toString();
		client.leave(chatId);
		console.log(`Client left the chat: Account = ${accountId}, Chat = ${chatId}`);
		return { event: 'leaveChat', data: { socketClient: client.id, accountId, chatId: chatId } };
	}

	// Начать печатать
	@SubscribeMessage('startTyping')
	async handleStartTyping(@MessageBody() data: { chatId: number }, @ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const chatId = data.chatId.toString();
		this.updateUserStatus(this.typingUsers, { chatId: data.chatId, userId: accountId }, 'add');
		this.server.to(chatId).emit('userTyping', { ...data, userId: accountId });
		console.log(`User started typing: Account=${accountId}, Chat=${data.chatId}`);
		return { event: 'userTyping', data: { ...data, userId: accountId } };
	}

	// Перестать печатать
	@SubscribeMessage('stopTyping')
	async handleStopTyping(@MessageBody() data: { chatId: number }, @ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		const chatId = data.chatId.toString();
		this.updateUserStatus(this.typingUsers, { chatId: data.chatId, userId: accountId }, 'remove');
		this.server.to(chatId).emit('userStopTyping', { ...data, userId: accountId });
		console.log(`User stopped typing: Account=${accountId}, Chat=${data.chatId}`);
		return { event: 'userStopTyping', data: { ...data, userId: accountId } };
	}

	// Отправить сообщение
	@SubscribeMessage('sendMessage')
	async handleSyncMessage(@MessageBody() data: WsChatMessageDto, @ConnectedSocket() client?: Socket) {
		if (client) {
			const accountId = await this.validateClient(client);
			if (!accountId || accountId !== data.senderId) return;
		}

		const chatId = data.chatId.toString();
		this.server.to(chatId).emit('syncMessage', data);
		console.log(`Message sent: Chat=${data.chatId}, Sender=${data.senderId}`);
		return { event: 'syncMessage', data, client };
	}

	// Прочитать сообщения
	@SubscribeMessage('readChat')
	async handleReadChat(@MessageBody() data: WsChatReadDto, @ConnectedSocket() client?: Socket) {
		if (client) {
			const accountId = await this.validateClient(client);
			if (!accountId || accountId !== data.readerId) return;
		}

		const chatId = data.chatId.toString();
		this.server.to(chatId).emit('syncReadStatus', data);
		console.log(`Message read: Chat=${data.chatId}, Reader=${data.readerId}`);
		return { event: 'syncReadStatus', data };
	}

	// Управление пользовательскими списками
	private updateUserStatus(
		map: Map<string, Set<string>>,
		data: { chatId: number; userId: number },
		action: 'add' | 'remove',
	): void {
		const userId = data.userId.toString();
		const chatId = data.chatId.toString();

		if (!map.has(chatId)) {
			map.set(chatId, new Set());
		}

		const userSet = map.get(chatId)!;
		if (action === 'add') {
			userSet.add(userId);
		} else {
			userSet.delete(userId);
			if (userSet.size === 0) {
				map.delete(chatId);
			}
		}
	}
}
