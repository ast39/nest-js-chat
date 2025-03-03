import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { WsChatMessageDto } from './dto/ws-chat-message.dto';
import { WsChatReadDto } from './dto/ws-chat-read.dto';

@WebSocketGateway(+process.env.SOCKET_PORT || 3001, {
	namespace: 'message',
	cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private readonly clientMap: Map<string, Socket> = new Map();
	private readonly typingUsers: Map<string, Set<string>> = new Map();

	constructor(private readonly jwtService: JwtService) {}

	afterInit() {
		console.log('WebSocket Server initialized successfully');
	}

	// Подключение клиента
	async handleConnection(@ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		if (!this.clientMap.has(client.id)) {
			this.clientMap.set(client.id, client);
			console.log(`Client connected: ID = ${client.id}, Account = ${accountId}`);
		}
	}

	// Отключение клиента
	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const accountId = await this.validateClient(client);
		if (!accountId) return;

		this.removeUserFromAllMaps(accountId.toString());
		this.clientMap.delete(client.id);
		console.log(`Client disconnected: ID = ${client.id}, Account = ${accountId}`);
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
		return { event: 'sendMessage', data, client };
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

	// Убрать пользователя из всех списков сокетного соединения
	private removeUserFromAllMaps(userId: string): void {
		const maps = [this.typingUsers];
		const events = ['userStopTyping'];

		maps.forEach((map, index) => {
			map.forEach((userSet, chatId) => {
				if (userSet.has(userId)) {
					userSet.delete(userId);
					if (userSet.size === 0) {
						map.delete(chatId);
					}
					this.server.to(chatId).emit(events[index], { userId });
				}
			});
		});
	}

	// Получить ID юзера по клиентскому соединению с сокетами
	private async validateClient(client: Socket): Promise<number | null> {
		const accountId = await this.getAccountIdFromToken(client);
		if (!accountId) {
			client.disconnect();
			console.log('Error: Unauthorized client, token missing or invalid');
			return null;
		}
		return accountId;
	}

	// Получить ID юзера из хэдэров
	private async getAccountIdFromToken(client: Socket): Promise<number | null> {
		const token = client.handshake.headers['authorization']?.split(' ')[1];
		if (!token) return null;

		try {
			const decoded = await this.jwtService.verifyAsync(token);
			return decoded.id ?? null;
		} catch (err) {
			console.log('Error: Token verification failed', err.message);
			return null;
		}
	}
}
