import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from '../../enums/member.enum';

@ObjectType()
export class Member {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberType: MemberType;

  @Field(() => String)
  memberStatus: MemberStatus;

  @Field(() => String)
  memberAuthType: MemberAuthType;

  @Field(() => String)
  memberPhone: string;

  @Field(() => String)
  memberNick: string;

  memberPassword?: string;

  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @Field(() => String)
  memberImage: string;

  @Field(() => String, { nullable: true })
  memberAddess?: string;

  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @Field(() => Int)
  memberProperties: number;

  @Field(() => Int)
  memberArticle: number;

  @Field(() => Int)
  memberFollowers: number;

  @Field(() => Int)
  memberFollowings: number;

  @Field(() => Int)
  memberLikes: number;

  @Field(() => Int)
  memberViews: number;

  @Field(() => Int)
  memberComments: number;

  @Field(() => Int)
  memberRank: number;

  @Field(() => Int)
  memberWarnings: number;

  @Field(() => Int)
  memberBlocks: number;

  @Field(() => Date)
  updatedAt: number;
}
