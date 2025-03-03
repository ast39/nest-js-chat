import { Body, Controller, Param, Get, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketMessageVersionCreateDto } from './dto/ticket-message-version.create.dto';
import { TicketMessageVersionDto } from './dto/ticket-message-version.dto';
import { TicketMessageVersionService } from './ticket-message-version.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { TicketMessageVersionFilterDto } from './dto/ticket-message-version.filter.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Тикеты :: История сообщений')
@Controller('ticket-message-version')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class TicketMessageVersionController {
	constructor(private messageVersionService: TicketMessageVersionService) {}

	@Get()
	@ApiOperation({
		summary: 'Список сообщений тикета в истории',
		description: 'Получить список сообщений тикета в истории по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список сообщений в истории тикета',
		type: TicketMessageVersionDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('ticket-message-version') url: string,
		@Query() query: TicketMessageVersionFilterDto,
	): Promise<PaginationInterface<TicketMessageVersionDto>> {
		return await this.messageVersionService.messageVersionList(url, query);
	}

	@Get(':version_id')
	@ApiOperation({
		summary: 'Версия сообщения тикета по ID',
		description: 'Получить информацию о версии сообщения тикета',
	})
	@ApiOkResponse({
		description: 'Информация о версии сообщения тикета',
		type: TicketMessageVersionDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('version_id') versionId: number): Promise<TicketMessageVersionDto> {
		return await this.messageVersionService.getMessageVersion(versionId);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiOperation({
		summary: 'Добавление сообщения тикета в историю',
		description: 'Добавление сообщения тикета в историю',
	})
	@ApiResponse({
		description: 'Добавленное сообщение тикета',
		type: TicketMessageVersionDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: TicketMessageVersionCreateDto): Promise<TicketMessageVersionDto> {
		return await this.messageVersionService.createMessageVersion(body);
	}
}
