import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { T } from '../../libs/types/common';
import { ViewInput } from '../../libs/dto/view/view.input';
import { View } from '../../libs/dto/view/view';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { Products } from '../../libs/dto/product/product';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisit } from '../../libs/config';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		const viewExist = await this.checkViewExistance(input);
		if (!viewExist) {
			console.log('-- New View Insert -');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistance(input: ViewInput): Promise<View> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedProducts(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.PRODUCT, memberId: memberId };
		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updateAt: -1 } },
				{
					$lookup: {
						from: 'product',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedProduct',
					},
				},
				{ $unwind: '$visitedProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisit,
							{ $unwind: '$visitedProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log('data', data);
		const result: Products = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.visitedProperty);

		console.log('result:', result);
		return result;
	}
}
