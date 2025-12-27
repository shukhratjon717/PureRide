import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEvent, AnalyticsEventSchema } from '../../schemas/AnalyticsEvent.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: AnalyticsEvent.name, schema: AnalyticsEventSchema }])],
	providers: [AnalyticsService],
	exports: [AnalyticsService],
})
export class AnalyticsModule {}
