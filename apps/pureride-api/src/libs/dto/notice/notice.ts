import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeStatus, NoticeType } from '../../enums/notice.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	noticeType: NoticeType;

	@Field(() => String)
	noticeContent: string;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => Int, { nullable: true })
	noticeLikes: number;

	@Field(() => Int, { nullable: true })
	noticeViews: number;

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Date, { nullable: true })
	createdAt?: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;

	memberId?: ObjectId
}

@ObjectType()
export class Notices {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
