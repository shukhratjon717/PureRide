import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CommentStatus } from '../../enums/comment.enum';
import { ObjectId } from 'mongoose';
import { MessageStatus } from '../../enums/message.enum';

@InputType()
export class MessageUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => MessageStatus, { nullable: true })
	messageStatus?: MessageStatus;

	@IsOptional()
	@Length(1, 100)
	@Field(() => String, { nullable: true })
	messageContent?: string;

	
}
