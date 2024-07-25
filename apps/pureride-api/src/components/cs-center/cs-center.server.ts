import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { AllNoticesInquiry, NoticeInput } from '../../libs/dto/cs-center/notice.input';
import { Notice, Notices } from '../../libs/dto/cs-center/notice';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../libs/dto/cs-center/notice.update';

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notice') private readonly noticeModel: Model<Notice>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
		private readonly notificationService: NotificationService,
	) {}

	public async createNoticeByAdmin(memberId: ObjectId, input: NoticeInput): Promise<Notice> {
		input.memberId = memberId;
		try {
			const result = await this.noticeModel.create(input);

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	// public async getNotice(memberId: ObjectId, noticeId: ObjectId): Promise<Notice> {
	// 	const search: T = {
	//         noiceStatus: NoticeStatus.ACTIVE,
	// 		_id: noticeId,
	// 	};
	// 	const targetNotice: Notice = await this.noticeModel.findOne(search).lean().exec();
	// 	if (!targetNotice) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

	// 	if (memberId) {
	// 		const viewInput = { memberId: memberId, viewRefId: noticeId, viewGroup: ViewGroup.ARTICLE };
	// 		const newView = await this.viewService.recordView(viewInput);
	// 		if (newView) {
	// 			await this.noticeEditor({ _id: noticeId, targetKey: 'noticeViews', modifier: 1 });
	// 			targetNotice.noticeViews++;
	// 		}
	// 		//meLiked

	// 		const likeInput = {
	// 			memberId: memberId,
	// 			likeRefId: noticeId,
	// 			likeGroup: LikeGroup.ARTICLE,
	// 		};
	// 		targetNotice.meLiked = await this.likeService.checkLikeExistence(likeInput);
	// 	}
	// 	targetNotice.memberData = await this.memberService.getMember(null, targetNotice.memberId);
	// 	return targetNotice;
	// }

	public async getAllNoticesByAdmin(input: AllNoticesInquiry): Promise<Notices> {
		const { noticeStatus, noticeCategory } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (noticeStatus) match.noticeStatus = noticeStatus;
		if (noticeCategory) match.noticeCategory = noticeCategory;

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async likeTargetNotice(memberId: ObjectId, likeRefId: ObjectId): Promise<Notice> {
		const target: Notice = await this.noticeModel
			.findOne({
				_id: likeRefId,
				noticeStatus: NoticeStatus.ACTIVE,
			})
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.ARTICLE,
		};

		const notInput: NotificationInput = {
			authorId: memberId,
			receiverId: target.memberId,
			productId: likeRefId,
			notificationGroup: NotificationGroup.MEMBER,
			notificationType: NotificationType.LIKE,
			notificationTitle: `You have unread notification`,
			notificationDesc: `${'memberNicl'} liked your Notice`,
		};

		//Like toogle
		const modifier: number = await this.likeService.toggleLike(input);

		const notificationInfo = await this.notificationService.createNotification(notInput);

		const result = await this.noticeEditor({
			_id: likeRefId,
			targetKey: 'noticeLikes',
			modifier: modifier,
		});
		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async updateNoticeByAdmin(input: NoticeUpdate): Promise<Notice> {
		const { _id, noticeStatus } = input;
		const result = await this.noticeModel
			.findOneAndUpdate({ _id: _id, noticeStatus: NoticeStatus.ACTIVE }, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async removeNoticeByAdmin(input: StatisticModifier): Promise<Notice> {
		const { _id, targetKey, modifier } = input;
		return await this.noticeModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async removeBoardArticlebyAdmin(articleId: ObjectId): Promise<Notice> {
		const search: T = { _id: articleId, articleStatus: BoardArticleStatus.DELETE };
		const result = await this.noticeModel.findByIdAndDelete(search).exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async noticeEditor(input: StatisticModifier): Promise<Notice> {
		const { _id, targetKey, modifier } = input;
		return await this.noticeModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}
