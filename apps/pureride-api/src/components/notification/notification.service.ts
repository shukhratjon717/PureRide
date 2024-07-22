import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	public async toggleLike(input: NotificationInput): Promise<number> {
		const search: T = { authorId: input.authorId, likeRefId: input.notificationRefId, productId: input.productId },
			exist = await this.notificationModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.notificationModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.notificationModel.create(input);
			} catch (err) {
				console.log('Error: Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`-like Modifier ${modifier} -`);
		return modifier;
	}
}
