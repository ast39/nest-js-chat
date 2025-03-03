import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TicketMessageRepository } from './ticket-message.repository';
import { TicketMessageUpdateDto } from './dto/ticket-message.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { TicketMessageCreateDto } from './dto/ticket-message.create.dto';
import { TicketMessageDto } from './dto/ticket-message.dto';
import { ITicketMessage } from './interfaces/ticket-message.prisma.interface';
import { TicketMessageValidation } from './validation/ticket-message.validation';
import { ChatGateway } from '../../gateway/chat/chat.gateway';
import { NotAccessException } from '../../common/exceptions/http-error-exception';
import { TicketValidation } from "../ticket/validation/ticket.validation";
import { TicketMessageVersionService } from "../ticketMessageVersion/ticket-message-version.service";
import { TicketRepository } from "../ticket/ticket.repository";
import { ETicketStatus, EUserType } from "@prisma/client";
import { TicketGateway } from "../../gateway/ticket/ticket.gateway";

@Injectable()
export class TicketMessageService {
	constructor(
		private prisma: PrismaService,
		private ticketMessageRepo: TicketMessageRepository,
		private ticketMessageValidator: TicketMessageValidation,
		private ticketValidator: TicketValidation,
		@Inject(forwardRef(() => TicketMessageVersionService))
		private ticketMessageVersionService: TicketMessageVersionService,
		private ticketRepository: TicketRepository,
		private readonly ticketGateway: TicketGateway,
	) {}

	/**
	 * Получить сообщение по ID
	 *
	 * @param messageId
	 * @param userId
	 * @param isAdmin
	 */
	async getMessage(messageId: number, userId: number, isAdmin: boolean = false): Promise<TicketMessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.ticketMessageValidator.assertMy(tx, messageId, userId, isAdmin);
			const ticketMessage = await this.ticketMessageRepo.show(messageId, tx);

			return new TicketMessageDto(ticketMessage as ITicketMessage);
		});
	}

	/**
	 * Создать новое сообщение
	 *
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async createMessage(data: TicketMessageCreateDto, userId: number, isAdmin: boolean = false): Promise<TicketMessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.ticketValidator.assertMy(tx, data.ticketId, userId, isAdmin);
			if (data.replyTo) {
				await this.ticketMessageValidator.assertMessageExists(tx, data.replyTo);
			}

			// Если тикета с юзером еще нет - создадим
			let checkTicket = await this.ticketRepository.show(userId);
			if (!checkTicket) {
				checkTicket = await this.ticketRepository.store({
					userId: userId,
					status: ETicketStatus.OPEN,
				});
			}

			// Если пишет саппорт, то проверим, что он может писать в этот тикет
			if (data.userType === EUserType.SUPPORT) {
				await Promise.all([
					this.ticketValidator.assertForProgress(tx, data.ticketId, userId),
					this.ticketValidator.assertForClose(tx, data.ticketId)
				]);

				// Если вопрос открыт, заберем его себе
				await this.ticketRepository.update({
					where: { id: userId },
					data: {
						assigned: userId,
						status: ETicketStatus.PROGRESS,
					},
				});
			}

			// Если пишет юзер и тикет закрыт - его надо открыть.
			if (data.userType === EUserType.CLIENT && checkTicket.status === ETicketStatus.CLOSE) {
				await this.ticketRepository.update({
					where: { id: userId },
					data: {
						assigned: null,
						status: ETicketStatus.OPEN,
					},
				});
			}

			else {
				// Если тикет уже есть - проверим что он открыт
				await Promise.all([
					this.ticketValidator.assertForProgress(tx, data.ticketId, userId),
					this.ticketValidator.assertForClose(tx, data.ticketId)
				]);
			}

			// Создадим сообщение
			const newTicketMessage = await this.ticketMessageRepo.store(userId, data, tx);

			// Событие в сокете о новом сообщении
			await this.ticketGateway.handleSyncMessage({
				ticketId: userId,
				userId: newTicketMessage.userId,
				userType: data.userType ?? EUserType.CLIENT,
				content: newTicketMessage.content ?? null,
				replyTo: newTicketMessage.replyToId ?? null,
			});

			return new TicketMessageDto(newTicketMessage as ITicketMessage);
		});
	}

	/**
	 * Обновить сообщение
	 *
	 * @param messageId
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async updateMessage(
		messageId: number,
		data: TicketMessageUpdateDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим текущее состояние сообщения
			const currentVersion = await this.getMessage(messageId, userId);

			if (currentVersion.userId !== userId && !isAdmin) {
				throw new NotAccessException();
			}

			// Отправить текущее сообщение в историю
			await this.ticketMessageVersionService.createMessageVersion({
				messageId: currentVersion.messageId,
				content: currentVersion.content,
			});

			// Обновить текушее сообшение
			await this.ticketMessageRepo.update(
				{
					where: { id: messageId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	/**
	 * Удалить сообщение
	 *
	 * @param messageId
	 * @param userId
	 * @param isAdmin
	 */
	async deleteMessage(messageId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([this.ticketMessageValidator.assertMy(tx, messageId, userId, isAdmin)]);
			await this.ticketMessageRepo.destroy({ id: messageId }, tx);

			return { success: true };
		});
	}
}
