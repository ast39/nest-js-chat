import { Body, Controller, Param, Get, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageVersionCreateDto } from './dto/message-version.create.dto';
import { MessageVersionDto } from './dto/message-version.dto';
import { MessageVersionService } from './message-version.service';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageVersionFilterDto } from './dto/message-version.filter.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Admin :: История сообщений')
@Controller('message-version')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class MessageVersionController {
	constructor(private messageVersionService: MessageVersionService) {}

	@Get()
	@ApiOperation({
		summary: 'Список сообщений в истории',
		description: 'Получить список сообщений в истории по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список сообщений в истории',
		type: MessageVersionDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('cms/message-version') url: string,
		@Query() query: MessageVersionFilterDto,
	): Promise<PaginationInterface<MessageVersionDto>> {
		return await this.messageVersionService.messageVersionList(url, query);
	}

	@Get(':version_id')
	@ApiOperation({
		summary: 'Версия сообщения по ID',
		description: 'Получить информацию о версии сообщения',
	})
	@ApiOkResponse({
		description: 'Информация о версии сообщения',
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
		summary: 'Добавление сообщения в историю',
		description: 'Добавление сообщения в историю',
	})
	@ApiResponse({
		description: 'Добавленное сообщение',
		type: MessageVersionDto,
		isArray: false,
		status: 201,
	})
	public async create(@Body() body: MessageVersionCreateDto): Promise<MessageVersionDto> {
		return await this.messageVersionService.createMessageVersion(body);
	}
}
