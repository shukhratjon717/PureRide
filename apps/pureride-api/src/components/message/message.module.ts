import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { ProductModule } from '../product/product.module';
import { NotificationModule } from '../notification/notification.module';
import MessageSchema from '../../schemas/Message.model';
import { MessageService } from './message.server';
import { MessageResolver } from './message.resolver';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Message',
				schema: MessageSchema,
			},
		]),
		AuthModule,
		MemberModule,
		ProductModule,
		BoardArticleModule,
		NotificationModule,
	],
	providers: [MessageResolver, MessageService],
	exports: [MessageModule],
})
export class MessageModule {}
