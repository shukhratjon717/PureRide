import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { ProductModule } from './product/product.module';
import { NoticeModule } from './cs-center/cs-center.module';
import { FaqModule } from './faq/faq.module';
import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		MemberModule,
		ProductModule,
		AuthModule,
		BoardArticleModule,
		CommentModule,
		FollowModule,
		LikeModule,
		ViewModule,
		NoticeModule,
		FaqModule,
		NotificationModule
	],
})
export class ComponentsModule {}
