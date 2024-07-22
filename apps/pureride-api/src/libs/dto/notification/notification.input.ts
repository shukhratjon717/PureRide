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

	@IsNotEmpty()
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsNotEmpty()
	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@IsNotEmpty()
	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@IsNotEmpty()
	@Field(() => String)
	notificationTitle: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationDesc?: string;

    @IsNotEmpty()
	@Field(() => String)
	notificationRefId: ObjectId;

  
}
