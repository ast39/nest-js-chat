import { Body, Controller, Param, Post, Put, Delete, HttpCode, HttpStatus, Get, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { TicketMessageService } from './ticket-message.service';
import { User } from '../../common/decorators/user.decorator';
import { TicketMessageUpdateDto } from "./dto/ticket-message.update.dto";
import { TicketMessageCreateDto } from "./dto/ticket-message.create.dto";
import { TicketMessageDto } from "./dto/ticket-message.dto";

@ApiTags('Тикеты :: Сообщения')
@Controller('ticket-message')
@ApiBearerAuth()
export class TicketMessageController {
	constructor(private ticketMessageService: TicketMessageService) {}

	@Get(':message_id')
	@ApiOperation({
		summary: 'Сообщение тикета по ID',
		description: 'Получить информацию о сообщении тикета',
	})
	@ApiOkResponse({
		description: 'Информация о сообщении тикета',
		type: TicketMessageDto,
		isArray: false,
		status: 200,
	})
	public async show(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('message_id', ParseIntPipe) messageId: number,
	): Promise<TicketMessageDto> {
		return await this.ticketMessageService.getMessage(messageId, userId, isAdmin);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление сообщения в тикет',
		description: 'Добавление сообщения в тикет',
	})
	@ApiResponse({
		description: 'Добавленное сообщение тикета',
		type: TicketMessageDto,
		isArray: false,
		status: 201,
	})
	public async create(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Body() body: TicketMessageCreateDto,
	): Promise<TicketMessageDto> {
		return await this.ticketMessageService.createMessage(body, userId, isAdmin);
	}

	@Put(':message_id')
	@ApiOperation({
		summary: 'Редактирование сообщения тикета',
		description: 'Редактирование сообщения тикета',
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
		@Body() body: TicketMessageUpdateDto,
	): Promise<DefaultResponse> {
		return await this.ticketMessageService.updateMessage(messageId, body, userId, isAdmin);
	}

	@Delete(':message_id')
	@ApiOperation({
		summary: 'Удаление сообщения тикета',
		description: 'Удалить сообщения тикета',
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
		return await this.ticketMessageService.deleteMessage(messageId, userId, isAdmin);
	}
}
