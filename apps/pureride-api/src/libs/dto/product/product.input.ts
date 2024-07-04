import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  isIn,
  isNotEmpty,
} from 'class-validator';
import { availableAgentSorts, availableMembersSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { ObjectId } from 'mongoose';
import {
  ProductEngineSize,
  ProductFuelType,
  ProductLocation,
  ProductType,
} from '../../enums/product.enum';

@InputType()
export class ProductInput {
  @IsNotEmpty()
  @Field(() => ProductType)
  productType: ProductType;

  @IsNotEmpty()
  @Field(() => ProductLocation)
  productLocation: ProductLocation;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  productAddress: string;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  productTitle: string;

  @IsNotEmpty()
  @Field(() => Number)
  productPrice: number;

  @IsNotEmpty()
  @Field(() => ProductEngineSize)
  productEngineSize: ProductEngineSize;

  @IsNotEmpty()
  @Field(() => ProductFuelType)
  productFuelType: ProductFuelType;

  @IsNotEmpty()
  @Field(() => String)
  productModel: string;

  @IsNotEmpty()
  @Field(() => String)
  productBrand: string;

  @IsNotEmpty()
  @Field(() => Int)
  productYear: number;

  @IsNotEmpty()
  @Field(() => Int)
  productMilage: number;

  @IsNotEmpty()
  @Field(() => [String])
  productImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  prodcutDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  prodcutBarter?: boolean;

  memberId?: ObjectId;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: number;
}
