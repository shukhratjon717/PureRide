import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { ProductModule } from '../product/product.module';
import { NotificationModule } from '../notification/notification.module';
import MessageSchema from '../../schemas/Message.model';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import MemberSchema from '../../schemas/Member.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
		AuthModule,
		MemberModule,
		ProductModule,
		NotificationModule,
		MemberModule,
	],
	providers: [MessageResolver, MessageService],
	exports: [MessageModule],
})
export class MessageModule {}
