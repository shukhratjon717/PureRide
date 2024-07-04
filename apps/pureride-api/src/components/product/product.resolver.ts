import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ProductInput } from '../../libs/dto/product/product.input';
import { ObjectId } from 'mongoose';
import { Product } from '../../libs/dto/product/product';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Roles(MemberType.AGENT)
  @Mutation(() => Product)
  @UseGuards(RolesGuard)
  public async createProduct(
    @Args('input') input: ProductInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product> {
    console.log('Mutation:, PropertyResolver');
    input.memberId = memberId;

    return await this.productService.createProduct(input);
  }
}
