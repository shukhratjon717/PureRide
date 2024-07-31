import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { IsNotEmpty, Min, IsOptional, IsIn, Length } from 'class-validator';
import { NoticeStatus, NoticeType } from '../../enums/notice.enum';
import { availableNotice } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeType)
	noticeType: NoticeType;

	@IsNotEmpty()
	@Length(1, 300)
	@Field(() => String)
	noticeContent: string;

	@IsOptional()
	@Length(1, 300)
	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	memberId?: ObjectId;
}

@InputType()
class NoticeSearch {
	// Renamed to avoid conflict
	@Field(() => String, { nullable: true })
	memberId?: string;

	@IsOptional()
	@Field(() => NoticeType, { nullable: true })
	noticeType?: NoticeType;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;
}

@InputType()
export class NoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNotice)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@IsIn(Object.values(NoticeType))
	@Field(() => NoticeType, { nullable: true })
	noticeType?: NoticeType;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => NoticeSearch, { nullable: true }) // Updated to match the renamed class
	search?: NoticeSearch;
}
