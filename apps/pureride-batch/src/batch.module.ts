import { Module } from '@nestjs/common';
import { PurerideBatchController } from './batch.controller';
import { ConfigModule } from '@nestjs/config';
import { BatchService } from './batch.service';

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [PurerideBatchController],
	providers: [BatchService],
})
export class BatchModule {}
