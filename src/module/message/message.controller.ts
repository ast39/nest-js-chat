import { Body, Controller, Param, Post, Put, Delete, HttpCode, HttpStatus, Get, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { MessageUpdateDto } from './dto/message.update.dto';
import { MessageCreateDto } from './dto/message.create.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('Сообщения')
@Controller('app/message')
@ApiBearerAuth()
export class MessageController {
	constructor(private messageService: MessageService) {}

	@Get(':message_id')
	@ApiOperation({
		summary: 'Сообщение по ID',
		description: 'Получить информацию о сообщении',
	})
	@ApiOkResponse({
		description: 'Информация о сообщении',
		type: MessageDto,
		isArray: false,
		status: 200,
	})
	public async show(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('message_id', ParseIntPipe) messageId: number,
	): Promise<MessageDto> {
		return await this.messageService.getMessage(messageId, userId, isAdmin);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление сообщения',
		description: 'Добавление сообщения в чат',
	})
	@ApiResponse({
		description: 'Добавленное сообщение',
		type: MessageDto,
		isArray: false,
		status: 201,
	})
	public async create(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Body() body: MessageCreateDto,
	): Promise<MessageDto> {
		return await this.messageService.createMessage(body, userId, isAdmin);
	}

	@Put(':message_id')
	@ApiOperation({
		summary: 'Редактирование сообщения',
		description: 'Редактирование сообщения',
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
		@Param('message_id', ParseIntPipe) messageId: number,
		@Body() body: MessageUpdateDto,
	): Promise<DefaultResponse> {
		return await this.messageService.updateMessage(messageId, body, userId, isAdmin);
	}

	@Delete(':message_id')
	@ApiOperation({
		summary: 'Удаление сообщения',
		description: 'Удалить сообщения',
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
		@Param('message_id', ParseIntPipe) messageId: number,
	): Promise<DefaultResponse> {
		return await this.messageService.deleteMessage(messageId, userId, isAdmin);
	}
}
