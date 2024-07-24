import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { BoardArticleService } from '../board-article/board-article.server';
import { ProductService } from '../product/product.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { MessageInput, MessagesInquiry } from '../../libs/dto/message/message.input';
import { MemberType } from '../../libs/enums/member.enum';
import { MessageStatus } from '../../libs/enums/message.enum';
import { MessageUpdate } from '../../libs/dto/message/message.update';
import { AgentMessage } from '../../libs/dto/message/message';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel('Message') private readonly messageModel: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly productService: ProductService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}

	public async createMessage(memberId: ObjectId, input: MessageInput): Promise<AgentMessage> {
		memberId = memberId;
		let result = null;
		if (!MemberType.AGENT) {
			try {
				result = await this.messageModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		const targetMember = await this.memberService.getMember(null, memberId);

		const notInput: NotificationInput = {
			authorId: memberId,
			receiverId: memberId,
			productId: memberId,
			notificationGroup: NotificationGroup.PRODUCT,
			notificationType: NotificationType.COMMENT,
			notificationTitle: `You have unread notification`,
			notificationDesc: `${targetMember.memberNick} commented about your product`,
		};

		const notificationInfo = await this.notificationService.createNotification(notInput);
		console.log('hello', notificationInfo);

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	// public async updateComment(memberId: ObjectId, input: MessageUpdate): Promise<T> {
	// 	const { _id } = input;
	// 	const result = await this.messageModel
	// 		.findByIdAndUpdate(
	// 			{
	// 				_id: _id,
	// 				memberId: memberId,
	// 				messageStatus: MessageStatus.ACTIVE,
	// 			},
	// 			input,
	// 			{
	// 				new: true,
	// 			},
	// 		)
	// 		.exec();
	// 	if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
	// 	return result;
	// }

	// public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
	// 	const { commentRefId } = input.search;
	// 	const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
	// 	const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

	// 	const result: Comments[] = await this.messageModel
	// 		.aggregate([
	// 			{ $match: match },
	// 			{ $sort: sort },
	// 			{
	// 				$facet: {
	// 					list: [
	// 						{ $skip: (input.page - 1) * input.limit },
	// 						{ $limit: input.limit },
	// 						//meLiked
	// 						lookupMember,
	// 						{ $unwind: '$memberData' },
	// 					],
	// 					metaCounter: [{ $count: 'total' }],
	// 				},
	// 			},
	// 		])
	// 		.exec();
	// 	if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

	// 	return result[0];
	// }
	// public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
	// 	const result = await this.messageModel.findByIdAndDelete(input).exec();
	// 	if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
	// 	return result;
	// }
}
