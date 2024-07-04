import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import ProductSchema from '../../schemas/Product.model';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
	],
	providers: [ProductResolver, ProductService],
	exports: [ProductService],
})
export class ProductModule {}
