import { Injectable } from '@nestjs/common';

@Injectable()
export class PurerideBatchService {
  getHello(): string {
    return 'Welcome to PureRide Batch server!!';
  }
}
