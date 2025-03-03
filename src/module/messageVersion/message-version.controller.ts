import { Body, Controller, Param, Get, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageVersionCreateDto } from './dto/message-version.create.dto';
import { MessageVersionDto } from './dto/message-version.dto';
import { MessageVersionService } from './message-version.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageVersionFilterDto } from './dto/message-version.filter.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Чаты :: История сообщений')
@Controller('chat-message-version')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class MessageVersionController {
	constructor(private messageVersionService: MessageVersionService) {}

	@Get()
	@ApiOperation({
		summary: 'Список сообщений чата в истории',
		description: 'Получить список сообщений чата в истории по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список сообщений чата в истории',
		type: MessageVersionDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl(' chat-message-version') url: string,
		@Query() query: MessageVersionFilterDto,
	): Promise<PaginationInterface<MessageVersionDto>> {
		return await this.messageVersionService.messageVersionList(url, query);
	}

	@Get(':version_id')
	@ApiOperation({
		summary: 'Версия сообщения чата по ID',
		description: 'Получить информацию о версии сообщения чата',
	})
	@ApiOkResponse({
		description: 'Информация о версии сообщения чата',
		type: MessageVersionDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('version_id') versionId: number): Promise<MessageVersionDto> {
		return await this.messageVersionService.getMessageVersion(versionId);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiOperation({
		summary: 'Добавление сообщения чата в историю',
		description: 'Добавление сообщения чата в историю',
	})
	@ApiResponse({
		description: 'Добавленное сообщение чата',
		type: MessageVersionDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: MessageVersionCreateDto): Promise<MessageVersionDto> {
		return await this.messageVersionService.createMessageVersion(body);
	}
}
