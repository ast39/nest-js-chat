import { Body, Controller, Param, Get, Post, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ChatDto } from './dto/chat.dto';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatService } from './chat.service';
import { User } from '../../common/decorators/user.decorator';
import { ChatFilterDto } from './dto/chat-filter.dto';
import { ChatCreateDto } from './dto/chat-create.dto';
import { ChatUpdateDto } from './dto/chat-update.dto';

@ApiTags('Чаты')
@Controller('app/chat')
@ApiBearerAuth()
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Get()
	@ApiOperation({
		summary: 'Список чатов',
		description: 'Получить список чатов по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список чатов',
		type: ChatDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@CurrentUrl('app/chat') url: string,
		@Query() query: ChatFilterDto,
	): Promise<PaginationInterface<ChatDto>> {
		return this.chatService.chatList(url, query, userId, isAdmin);
	}

	@Get(':chat_id')
	@ApiOperation({
		summary: 'Чат по ID',
		description: 'Получить информацию о чате',
	})
	@ApiOkResponse({
		description: 'Информация о чате',
		type: ChatDto,
		isArray: false,
		status: 200,
	})
	public async show(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('chat_id') chatId: number,
	): Promise<ChatDto> {
		return this.chatService.getChat(chatId, userId, isAdmin);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiOperation({
		summary: 'Создание чата',
		description: 'Создание чата',
	})
	@ApiResponse({
		description: 'Добавленный чат',
		type: ChatDto,
		isArray: false,
		status: 201,
	})
	public async create(@User('id') userId: number, @Body() body: ChatCreateDto): Promise<ChatDto> {
		return this.chatService.createChat(body, userId);
	}

	@Put(':chat_id')
	@ApiOperation({
		summary: 'Редактирование чата',
		description: 'Редактирование чата',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async update(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('chat_id') chatId: number,
		@Body() body: ChatUpdateDto,
	): Promise<DefaultResponse> {
		return this.chatService.updateChat(chatId, body, userId, isAdmin);
	}

	@Put('read/:chat_id')
	@ApiOperation({
		summary: 'Прочитать все сообщения партнера',
		description: 'Прочитать все сообщения партнера',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async readMessages(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('chat_id') chatId: number,
	): Promise<DefaultResponse> {
		return this.chatService.readChatMessages(chatId, userId, isAdmin);
	}

	@Delete(':chat_id')
	@ApiOperation({
		summary: 'Удаление чата (только своего)',
		description: 'Удалить чат (только свой)',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	public async delete(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('chat_id') chatId: number,
	): Promise<DefaultResponse> {
		return this.chatService.deleteChat(chatId, userId, isAdmin);
	}
}
