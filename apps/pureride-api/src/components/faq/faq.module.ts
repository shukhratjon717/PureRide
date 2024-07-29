import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import { NotificationModule } from '../notification/notification.module';
import FaqSchema from '../../schemas/Faq.schema.model';
import { FaqService } from './faq.service';
import { FaqResolver } from './faq.resolver';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Faq',
				schema: FaqSchema,
			},
		]),
		AuthModule,
		MemberModule,
		ViewModule,
		LikeModule,
		NotificationModule,
	],
	providers: [FaqResolver, FaqService],
	exports: [FaqResolver],
})
export class FaqModule {}
