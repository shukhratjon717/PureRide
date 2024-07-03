import { Controller, Get } from '@nestjs/common';
import { PurerideBatchService } from './pureride-batch.service';

@Controller()
export class PurerideBatchController {
  constructor(private readonly purerideBatchService: PurerideBatchService) {}

  @Get()
  getHello(): string {
    return this.purerideBatchService.getHello();
  }
}
