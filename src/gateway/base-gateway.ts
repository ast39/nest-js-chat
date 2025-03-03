import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

export abstract class BaseGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  protected readonly clientMap: Map<string, Socket> = new Map();
  protected readonly typingUsers: Map<string, Set<string>> = new Map();

  constructor(protected readonly jwtService: JwtService) {}

  afterInit() {
    console.log(`WebSocket Server for ${this.getNamespace()} initialized successfully`);
  }

  async handleConnection(client: Socket) {
    const accountId = await this.validateClient(client);
    if (!accountId) return;

    if (!this.clientMap.has(client.id)) {
      this.clientMap.set(client.id, client);
      console.log(`Client connected: ID = ${client.id}, Account = ${accountId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const accountId = await this.validateClient(client);
    if (!accountId) return;

    this.removeUserFromAllMaps(accountId.toString());
    this.clientMap.delete(client.id);
    console.log(`Client disconnected: ID = ${client.id}, Account = ${accountId}`);
  }

  protected async validateClient(client: Socket): Promise<number | null> {
    const accountId = await this.getAccountIdFromToken(client);
    if (!accountId) {
      client.disconnect();
      console.log('Error: Unauthorized client, token missing or invalid');
      return null;
    }
    return accountId;
  }

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

  // Удаление пользователя из всех мап и отправка событий
  protected removeUserFromAllMaps(userId: string): void {
    this.typingUsers.forEach((userSet, chatId) => {
      if (userSet.has(userId)) {
        userSet.delete(userId);
        if (userSet.size === 0) {
          this.typingUsers.delete(chatId);
        }
        this.getNamespace() === 'CHAT'
          ? this.server.to(chatId).emit('userStopTyping', { userId })
          : this.server.to(chatId).emit('userStopTypingInTicket', { userId });
      }
    });
  }

  protected abstract getNamespace(): string;
}
