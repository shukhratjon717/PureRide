import { Field, ObjectType } from '@nestjs/graphql';
import { LikeGroup } from '../../enums/like.enum';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationType } from '../../enums/notification.enum';

@ObjectType()
export class MeLiked {
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

	@Field(() => NotificationType)
	notificationType: NotificationType;

    @Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => String)
	articleId: ObjectId;

	@Field(() => LikeGroup)
	likeGroup: LikeGroup;

	@Field(() => String)
	notificationRefId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
