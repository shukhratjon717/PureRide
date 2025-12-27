import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';
import { AnalyticsModule } from '../components/analytics/analytics.module';

@Module({
	imports: [AuthModule, AnalyticsModule],
	providers: [SocketGateway],
})
export class SocketModule {}
