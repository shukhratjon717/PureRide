import { Module } from '@nestjs/common';
import { PurerideBatchController } from './pureride-batch.controller';
import { PurerideBatchService } from './pureride-batch.service';

@Module({
  imports: [],
  controllers: [PurerideBatchController],
  providers: [PurerideBatchService],
})
export class PurerideBatchModule {}
