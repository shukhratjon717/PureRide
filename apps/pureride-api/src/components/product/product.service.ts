import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../../libs/dto/member/member';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Product } from '../../libs/dto/product/product';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product')
		private readonly productModel: Model<Product>,
		private memberService: MemberService,
	) {}

	public async createProduct(input: ProductInput): Promise<Product> {
		try {
			const result = await this.productModel.create(input);
			console.log('result:', result);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProducts',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, productService.Model:', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
