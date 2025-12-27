import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AnalyticsEventDocument = AnalyticsEvent & Document;

export enum EventType {
	USER_LOGIN = 'USER_LOGIN',
	USER_LOGOUT = 'USER_LOGOUT',
	USER_SIGNUP = 'USER_SIGNUP',
	PRODUCT_VIEW = 'PRODUCT_VIEW',
	PRODUCT_PURCHASE = 'PRODUCT_PURCHASE',
	PRODUCT_LIKE = 'PRODUCT_LIKE',
	COMMENT_CREATE = 'COMMENT_CREATE',
	FOLLOW_USER = 'FOLLOW_USER',
	PAGE_VIEW = 'PAGE_VIEW',
}

@Schema({ timestamps: true })
export class AnalyticsEvent {
	@Prop({ required: true, enum: EventType, index: true })
	eventType: EventType;

	@Prop({ type: MongooseSchema.Types.Mixed, required: true })
	eventData: Record<string, any>;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', index: true })
	memberId: MongooseSchema.Types.ObjectId;

	@Prop({ type: Date, default: Date.now, index: true })
	timestamp: Date;

	@Prop({ type: MongooseSchema.Types.Mixed })
	metadata: {
		ipAddress?: string;
		userAgent?: string;
		sessionId?: string;
		[key: string]: any;
	};

	@Prop({ type: Date, default: Date.now, expires: 604800 }) // TTL: 7 days (604800 seconds)
	createdAt: Date;

	@Prop({ type: Date, default: Date.now })
	updatedAt: Date;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);

// Compound index for efficient queries by event type and timestamp
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });

// Index for member-specific queries
AnalyticsEventSchema.index({ memberId: 1, timestamp: -1 });
