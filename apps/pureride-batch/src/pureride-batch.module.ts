import { Module } from '@nestjs/common';
import { PurerideBatchController } from './pureride-batch.controller';
import { PurerideBatchService } from './pureride-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PurerideBatchController],
  providers: [PurerideBatchService],
})
export class PurerideBatchModule {}
