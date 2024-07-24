import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';
import { availableCommentSorts } from '../../config';
import { MessageGroup } from '../../enums/message.enum';

@InputType()
export class MessageInput {
	@IsNotEmpty()
	@Field(() => MessageGroup)
	messageGroup: MessageGroup;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	messageContent: string;

	@IsNotEmpty()
	@Field(() => String)
	messageRefId: ObjectId;

	memberId?: ObjectId;
}

@InputType()
class MISearch {
	@IsNotEmpty()
	@Field(() => String)
	messageRefId: ObjectId;
}

@InputType()
export class MessagesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => MISearch)
	search: MISearch;
}
