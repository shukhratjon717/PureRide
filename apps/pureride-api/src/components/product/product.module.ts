import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import ProductSchema from '../../schemas/Product.model';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
		NotificationModule,
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	],
	providers: [ProductResolver, ProductService],
	exports: [ProductService],
})
export class ProductModule {}
