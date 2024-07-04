import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
  ProductEngineSize,
  ProductFuelType,
  ProductLocation,
  ProductStatus,
  ProductType,
} from '../../enums/product.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Product {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => ProductLocation)
  productLocation: ProductLocation;

  @Field(() => String)
  productAddress: string;

  @Field(() => String)
  productTitle: string;

  @Field(() => Number)
  productPrice: number;

  @Field(() => ProductEngineSize)
  productEngineSize: ProductEngineSize;

  @Field(() => ProductFuelType)
  productFuelType: ProductFuelType;

  @Field(() => String)
  productModel: string;

  @Field(() => String)
  productBrand: string;

  @Field(() => Int)
  productYear: number;

  @Field(() => Int)
  productMilage: number;

  @Field(() => Int)
  productViews: number;

  @Field(() => Int)
  productLikes: number;

  @Field(() => Int)
  productComments: string;

  @Field(() => Int)
  productRank: number;

  @Field(() => [String])
  productImages: string[];

  @Field(() => String, { nullable: true })
  productDesc?: string;

  @Field(() => Boolean)
  productBarter: boolean;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date, { nullable: true })
  soldAt?: number;

  @Field(() => Date, { nullable: true })
  deletedAt?: number;

  @Field(() => Date, { nullable: true })
  constructedAt?: number;

  @Field(() => Date)
  createdAt: number;

  @Field(() => Date)
  updatedAt: number;

	/** from aggrigation**/

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Products {
	@Field(() => [Product])
	list: Product[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}