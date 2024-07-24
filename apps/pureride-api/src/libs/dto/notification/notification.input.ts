import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

@InputType()
export class NotificationInput {
	@IsNotEmpty()
	@Field(() => String)
	authorId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	productId: ObjectId;

	@IsOptional()
	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@IsOptional()
	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;

	@IsOptional()
	@Field(() => NotificationGroup, { nullable: true })
	notificationGroup?: NotificationGroup;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationRefId?: ObjectId;
}
