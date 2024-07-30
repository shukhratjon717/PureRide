import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Member, TotalCounter } from '../member/member';
import { FaqStatus, FaqType } from '../../enums/faqCategory.enum';

@ObjectType()
export class FaqDto {
	@Field(() => String)
	_id: ObjectId;
	@Field(() => String)
	memberId?: ObjectId;

	@Field(() => String)
	faqQuestion: string;

	@Field(() => String)
	faqAnswer: string;

	@Field(() => FaqType)
	faqType: FaqType;

	@Field(() => FaqStatus, { nullable: true })
	faqStatus?: FaqStatus;

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Date, { nullable: true })
	createdAt?: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;
}

@ObjectType()
export class FaqsDto {
	@Field(() => [FaqDto])
	list: FaqDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
