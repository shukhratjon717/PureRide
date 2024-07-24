import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class MeNotified {
	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	notificationRefId: ObjectId;

	@Field(() => Boolean)
	myNotification: boolean;
}

@ObjectType()
export class Notification {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;

	@Field(() => NotificationGroup, { nullable: true })
	notificationGroup?: NotificationGroup;

	@Field(() => String, { nullable: true })
	authorId?: ObjectId;

	@Field(() => String, { nullable: true })
	receiverId?: ObjectId;

	@Field(() => String, { nullable: true })
	productId?: ObjectId;

	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@Field(() => String, { nullable: true })
	notificationRefId?: ObjectId;

	@Field(() => [MeNotified], { nullable: true })
	meNotfied?: MeNotified[];
}

@ObjectType()
export class Notifications {
	@Field(() => [Notification])
	list: Notification[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
