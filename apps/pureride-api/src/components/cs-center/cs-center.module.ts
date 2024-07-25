import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import { NotificationModule } from '../notification/notification.module';
import NoticeSchema from '../../schemas/Notice.model';
import { NoticeResolver } from './cs-center.resolver';
import { NoticeService } from './cs-center.server';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notice',
				schema: NoticeSchema,
			},
		]),
		AuthModule,
		MemberModule,
		ViewModule,
		LikeModule,
		NotificationModule,
	],
	providers: [NoticeResolver, NoticeService],
	exports: [NoticeResolver],
})
export class NoticeModule {}
