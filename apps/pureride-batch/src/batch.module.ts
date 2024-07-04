import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BatchService } from "./batch.service";
import { DatabaseModule } from "./database/database.module";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import ProductSchema from "apps/pureride-api/src/schemas/Product.model";
import MemberSchema from "apps/pureride-api/src/schemas/Member.model";
import { PurerideBatchController } from "./batch.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: "Products", schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: "Member", schema: MemberSchema }]),
  ],
  controllers: [PurerideBatchController],
  providers: [BatchService],
})
export class BatchModule {}
