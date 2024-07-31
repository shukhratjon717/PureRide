import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { lookupMember, lookupMessage, shapeIntoMongoObjectId } from '../../libs/config';
import { BoardArticleService } from '../board-article/board-article.server';
import { ProductService } from '../product/product.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { MessageInput, MessagesInquiry } from '../../libs/dto/message/message.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { MessageGroup, MessageStatus } from '../../libs/enums/message.enum';
import { MessageUpdate } from '../../libs/dto/message/message.update';
import { AgentMessage, AgentMessages } from '../../libs/dto/message/message';
import { Member } from '../../libs/dto/member/member';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel('Message') private readonly messageModel: Model<AgentMessage>,
		@InjectModel('Member')
		private readonly memberModel: Model<Member>,
		private readonly memberService: MemberService,
		private readonly notificationService: NotificationService,
	) {}

	public async createMessage(memberId: ObjectId, input: MessageInput): Promise<AgentMessage> {
		input.memberId = memberId;
		const mesId = shapeIntoMongoObjectId(input.messageRefId);

		let result = null;
		console.log('input:', input);

		try {
			result = await this.messageModel.create(input);
		} catch (err) {
			console.error('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
		switch (input.messageGroup) {
			case MessageGroup.AGENT:
				await this.memberService.memberStatsEditor({
					_id: mesId,
					targetKey: 'memberMessages',
					modifier: 1,
				});
				break;
		}

		if (!result) {
			throw new InternalServerErrorException('ughiuhui');
		}
		return result;
	}

	public async updateMessage(memberId: ObjectId, input: MessageUpdate): Promise<AgentMessage> {
		const { _id } = input;
		const result = await this.messageModel
			.findByIdAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					messageStatus: MessageStatus.ACTIVE,
				},
				input,
				{
					new: true,
				},
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getMessages(memberId: ObjectId, input: MessagesInquiry): Promise<AgentMessages> {
		const { messageRefId } = input.search;
		const match: T = { messageRefId: messageRefId, messageStatus: MessageStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		console.log('match', match);
		console.log('sort', sort);
		const result: AgentMessages[] = await this.messageModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							//meLiked
							lookupMember,
							// { $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
	public async removeMessage(input: ObjectId): Promise<AgentMessage> {
		const result = await this.messageModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
