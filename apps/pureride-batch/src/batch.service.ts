import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
	public async batchRollback(): Promise<void> {
		console.log('batchRollback');
	}
	public async batchProducts(): Promise<void> {
		console.log('batchProducts');
	}
	public async batchAgents(): Promise<void> {
		console.log('batchAgents');
	}
	public getHello(): string {
		return 'Welcome to Nestar Batch server!';
	}
}
