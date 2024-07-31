import { Field, ObjectType } from '@nestjs/graphql';
import { MessageGroup, MessageStatus } from '../../enums/message.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class AgentMessage {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => MessageStatus)
	messageStatus: MessageStatus;

	@Field(() => MessageGroup)
	messageGroup: MessageGroup;

	@Field(() => String)
	messageContent: string;

	@Field(() => String)
	messageRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class AgentMessages {
	@Field(() => [AgentMessage])
	list: AgentMessage[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
