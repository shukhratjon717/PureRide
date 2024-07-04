import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FollowService } from "./follow.service";
import FollowSchema from "../../schemas/Follow.model";
import { AuthModule } from "../auth/auth.module";
import { MemberModule } from "../member/member.module";
import { FollowResolver } from "./follow.resolver";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Follow", schema: FollowSchema }]),
    AuthModule,
    MemberModule,
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowService],
})
export class FollowModule {}
