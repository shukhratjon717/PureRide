import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min, IsMongoId } from 'class-validator';
import { Direction } from '../../enums/common.enum';
import { availableMessageSorts } from '../../config';
import { MessageGroup } from '../../enums/message.enum';
import { ObjectId } from 'mongoose';

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

	memberId: ObjectId;
}

@InputType()
class MSISearch {
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
	@IsIn(availableMessageSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => MSISearch)
	search: MSISearch;
}
