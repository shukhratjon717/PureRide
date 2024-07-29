import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import NotificationSchema from '../../schemas/Notification.model';
import { AuthModule } from '../auth/auth.module';
import { NotificationResolver } from './notification.solver';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]), AuthModule],

	providers: [NotificationService, NotificationResolver],
	exports: [NotificationService],
})
export class NotificationModule {}
