import { Module } from '@nestjs/common';
import { BoardArticleResolver } from './board-article.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import { BoardArticleService } from './board-article.server';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'BoardArticle',
				schema: BoardArticleSchema,
			},
		]),
		AuthModule,
		MemberModule,
		ViewModule,
		LikeModule,
	],
	providers: [BoardArticleResolver, BoardArticleService],
	exports: [BoardArticleService],
})
export class BoardArticleModule {}
