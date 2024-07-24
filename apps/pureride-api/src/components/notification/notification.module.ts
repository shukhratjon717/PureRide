import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import NotificationSchema from '../../schemas/Notification.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }])],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
