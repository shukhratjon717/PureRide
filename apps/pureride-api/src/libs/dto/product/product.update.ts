import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import {
  ProductEngineSize,
  ProductFuelType,
  ProductLocation,
  ProductStatus,
  ProductType,
} from '../../enums/product.enum';

@InputType()
export class ProductUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ProductType, { nullable: true })
  productType?: ProductType;

  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Field(() => ProductLocation, { nullable: true })
  productLocation?: ProductLocation;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  productAddress?: string;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  productTitle?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  productPrice?: number;

  @IsOptional()
  @Field(() => ProductEngineSize, { nullable: true })
  productEngineSize: ProductEngineSize;

  @IsOptional()
  @Field(() => ProductFuelType, { nullable: true })
  productFuelType: ProductFuelType;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productModel: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productBrand: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productYear: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productMilage: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  productBarter?: boolean;

  soldAt?: Date;

  deletedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;
}
