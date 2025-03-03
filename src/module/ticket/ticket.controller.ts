import { Body, Controller, Param, Get, Post, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { User } from '../../common/decorators/user.decorator';
import { TicketDto } from "./dto/ticket.dto";
import { TicketUpdateDto } from "./dto/ticket-update.dto";
import { TicketCreateDto } from "./dto/ticket-create.dto";
import { TicketFilterDto } from "./dto/ticket-filter.dto";
import { TicketService } from "./ticket.service";

@ApiTags('Тикеты')
@Controller('ticket')
@ApiBearerAuth()
export class TicketController {
	constructor(private ticketService: TicketService) {}

	@Get()
	@ApiOperation({
		summary: 'Список тикетов',
		description: 'Получить список тикетов по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список тикетов',
		type: TicketDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@CurrentUrl('ticket') url: string,
		@Query() query: TicketFilterDto,
	): Promise<PaginationInterface<TicketDto>> {
		return this.ticketService.ticketList(url, query, userId, isAdmin);
	}

	@Get(':ticket_id')
	@ApiOperation({
		summary: 'Тикет по ID',
		description: 'Получить информацию о тикете',
	})
	@ApiOkResponse({
		description: 'Информация о тикете',
		type: TicketDto,
		isArray: false,
		status: 200,
	})
	public async show(
		@User('id') userId: number,
		@User('isAdmin') isAdmin: boolean,
		@Param('ticket_id') chatId: number,
	): Promise<TicketDto> {
		return this.ticketService.getTicket(chatId, userId, isAdmin);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiOperation({
		summary: 'Создание тикета',
		description: 'Создание тикета',
	})
	@ApiResponse({
		description: 'Добавленный тикет',
		type: TicketDto,
		isArray: false,
		status: 201,
	})
	public async create(@User('id') userId: number, @Body() body: TicketCreateDto): Promise<TicketDto> {
		return this.ticketService.createTicket(body, userId);
	}

	@Put(':ticket_id')
	@ApiOperation({
		summary: 'Редактирование тикета',
		description: 'Редактирование тикета',
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
		@Param('ticket_id') ticketId: number,
		@Body() body: TicketUpdateDto,
	): Promise<DefaultResponse> {
		return this.ticketService.updateTicket(ticketId, body, userId, isAdmin);
	}

	@Put('read/:ticket_id')
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
		@Param('ticket_id') ticketId: number,
	): Promise<DefaultResponse> {
		return this.ticketService.readTicketMessages(ticketId, userId, isAdmin);
	}

	@Delete(':ticket_id')
	@ApiOperation({
		summary: 'Удаление тикета',
		description: 'Удалить тикет',
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
		@Param('ticket_id') ticketId: number,
	): Promise<DefaultResponse> {
		return this.ticketService.deleteTicket(ticketId, userId, isAdmin);
	}
}
