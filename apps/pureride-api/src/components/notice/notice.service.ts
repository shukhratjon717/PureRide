import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupMember, lookupNotice } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';

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

	public async getNotice(memberId: ObjectId, noticeId: ObjectId): Promise<Notice> {
		const search: T = {
			noiceStatus: NoticeStatus.ACTIVE,
			_id: noticeId,
		};
		const targetNotice: Notice = await this.noticeModel.findOne(search).lean().exec();
		if (!targetNotice) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: noticeId, viewGroup: ViewGroup.ARTICLE };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.noticeEditor({ _id: noticeId, targetKey: 'noticeViews', modifier: 1 });
				targetNotice.noticeViews++;
			}
			//meLiked
		}
		targetNotice.memberData = await this.memberService.getMember(null, targetNotice.memberId);
		return targetNotice;
	}

	public async getAllNoticesByAdmin(input: NoticesInquiry): Promise<Notices> {
		const { noticeType, text, noticeStatus } = input;

		console.log(input, 'GET NOTICES');

		const match: T = {};
		if (noticeType) {
			match.noticeType = noticeType;
		}

		if (noticeStatus) {
			match.noticeStatus = noticeStatus;
		}

		if (text) {
			match.noticeContent = { $regex: new RegExp(text, 'i') };
		}
		console.log(match, 'MATCH');

		const sort: T = { ['createdAt']: -1 };
		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result || !result[0]) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const noticesResult = result[0];

		const noticesDto: Notices = {
			list: noticesResult.list.map((item: Notice) => ({
				_id: item._id,
				noticeContent: item.noticeContent,
				noticeType: item.noticeType,
				memberData: item.memberData,
				noticeStatus: item.noticeStatus,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			})),
			metaCounter: noticesResult.metaCounter,
		};

		return noticesDto;
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
