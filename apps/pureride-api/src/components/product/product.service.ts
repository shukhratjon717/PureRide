import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../../libs/dto/member/member';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product')
		private readonly productModel: Model<null>,
	) {}
}
