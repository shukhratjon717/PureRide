import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { NotificationGroup } from '../../libs/enums/notification.enum';
import { lookupNotification } from '../../libs/config';
import { Notifications, Notification } from '../../libs/dto/notification/notification';
import { T } from '../../libs/types/common';
import { NotificationInput } from '../../libs/dto/notification/notification.input';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification')
		private readonly notificationModel: Model<Notification>,
	) {}

	public async createNotification(input: NotificationInput): Promise<Notification | null> {
		try {
			return await this.notificationModel.create(input);
		} catch (err) {
			throw new Error(`Error on NotificationServer', ${err}`);
		}
	}

	public async getProductNotifications(receiverId: ObjectId, input: OrdinaryInquiry): Promise<Notifications> {
		const { page, limit } = input;
		const match = {
			notificationGroup: NotificationGroup.PRODUCT,
			receiverId: receiverId,
		};

		const data = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'product',
						localField: 'notificationRefId',
						foreignField: '_id',
						as: 'notifiedProduct',
					},
				},
				{ $unwind: '$notifiedProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupNotification,
							{ $unwind: '$notifiedProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		console.log('data:', data);
		const result: Notifications = { list: [], metaCounter: data[0]?.metaCounter || [] };

		if (data[0] && data[0].list) {
			result.list = data[0].list.map((ele) => ele.notifiedProduct);
		}

		console.log('result:', result);
		return result;
	}

	public async getArticleNotifications(receiverId: ObjectId, input: OrdinaryInquiry): Promise<Notifications> {
		const { page, limit } = input;
		const match = {
			notificationGroup: NotificationGroup.ARTICLE,
			receiverId: receiverId,
		};

		const data = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'boardArticles',
						localField: 'notificationRefId',
						foreignField: '_id',
						as: 'notifiedProduct',
					},
				},
				{ $unwind: '$notifiedProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupNotification,
							{ $unwind: '$notifiedProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		console.log('data:', data);
		const result: Notifications = { list: [], metaCounter: data[0]?.metaCounter || [] };

		if (data[0] && data[0].list) {
			result.list = data[0].list.map((ele) => ele.notifiedProduct);
		}

		console.log('result:', result);
		return result;
	}
}
