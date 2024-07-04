import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ProductInput } from '../../libs/dto/product/product.input';
import { ObjectId } from 'mongoose';
import { Product } from '../../libs/dto/product/product';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async createProduct(
    @Args('input') input: ProductInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product> {
    console.log('Mutation:, createProduct');
    input.memberId = memberId;

    return await this.productService.createProduct(input);
  }

  @UseGuards(WithoutGuard)
  @Query((returns) => Product)
  public async getProduct(
    @Args('productId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product> {
    console.log('Query: getProduct');
    const productId = shapeIntoMongoObjectId(input);
    return await this.productService.getProduct(memberId, productId);
  }
}
