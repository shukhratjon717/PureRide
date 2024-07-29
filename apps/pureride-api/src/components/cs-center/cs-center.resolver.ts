import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllNoticesInquiry, NoticeInput } from '../../libs/dto/cs-center/notice.input';
import { Notice, Notices } from '../../libs/dto/cs-center/notice';
import { NoticeService } from './cs-center.service';
import { WithoutGuard } from '../auth/guards/without.guard';
import { NoticeUpdate } from '../../libs/dto/cs-center/notice.update';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Notice)
	public async createNoticeByAdmin(
		@Args('input') input: NoticeInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: CerateBoardAtricle');
		return await this.noticeService.createNoticeByAdmin(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notice)
	public async likeTargetNotice(
		@Args('noticeId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: likeTargetNotice');
		const likeRefId = shapeIntoMongoObjectId(input);
		return this.noticeService.likeTargetNotice(memberId, likeRefId);
	}

	@UseGuards(RolesGuard)
	@Query((returns) => Notices)
	public async getAllNoticesByAdmin(
		@Args('ipnut') input: AllNoticesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		console.log('Query: getAllBoardArticlesByAdmin ');
		return await this.noticeService.getAllNoticesByAdmin(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notice)
	public async getNotice(@Args('noticeId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Notice> {
		console.log('Mutation: getBoardArticle');
		const noticeId = shapeIntoMongoObjectId(input);
		return await this.noticeService.getNotice(memberId, noticeId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async updateNoticeByAdmin(
		@Args('input') input: NoticeUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Query: getAllBoardArticlesByAdmin ');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.noticeService.updateNoticeByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async removeNoticeByAdmin(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Query: getAllBoardArticlesByAdmin ');
		const articleId = shapeIntoMongoObjectId(input);
		return await this.noticeService.removeNoticeByAdmin(articleId);
	}
}
