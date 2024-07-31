import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min, isIn, isNotEmpty } from 'class-validator';
import { availableAgentSorts, availableMembersSorts, availableOptions, availableProductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { ObjectId } from 'mongoose';
import {
	ProductEngineSize,
	ProductFuelType,
	ProductLocation,
	ProductStatus,
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

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productRent?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productBarter?: boolean;

	@IsNotEmpty()
	@Field(() => Number)
	productPrice: number;

	@IsOptional()
	@Field(() => ProductEngineSize, { nullable: true })
	productEngineSize?: ProductEngineSize;

	@IsOptional()
	@Field(() => ProductFuelType, { nullable: true })
	productFuelType?: ProductFuelType;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	productModel?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	productColor?: string;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	productBrand?: string;

	@IsNotEmpty()
	@Field(() => Int)
	productYear: number;

	@IsNotEmpty()
	@Field(() => Int, { nullable: true })
	productMileage?: number;

	@IsNotEmpty()
	@Field(() => [String])
	productImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	productDesc?: string;

	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: number;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class EnginesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [ProductLocation], { nullable: true })
	locationList?: ProductLocation[];

	@IsOptional()
	@Field(() => [ProductType], { nullable: true })
	typeList?: ProductType[]; // Correctly define typeList

	@IsOptional()
	@Field(() => [ProductEngineSize], { nullable: true })
	engineList?: ProductEngineSize[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	yearList?: string[];

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => EnginesRange, { nullable: true })
	enginesRange?: EnginesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;
}

@InputType()
export class AgentProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => [ProductLocation], { nullable: true })
	productLocationList?: ProductLocation[];
}

@InputType()
export class AllProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
