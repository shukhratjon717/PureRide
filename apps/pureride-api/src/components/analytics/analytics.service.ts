import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { AnalyticsEvent, AnalyticsEventDocument, EventType } from '../../schemas/AnalyticsEvent.model';

interface ActiveUser {
	memberId: string;
	memberNick: string;
	lastActivity: Date;
}

interface SalesVelocityItem {
	productId: string;
	productName: string;
	salesCount: number;
	lastSale: Date;
}

interface TopPerformer {
	memberId: string;
	memberNick: string;
	activityCount: number;
	recentActivities: string[];
}

interface RecentActivity {
	eventType: EventType;
	memberNick: string;
	timestamp: Date;
	description: string;
}

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectModel(AnalyticsEvent.name)
		private analyticsEventModel: Model<AnalyticsEventDocument>,
	) {}

	/**
	 * Track a new analytics event
	 */
	async trackEvent(
		eventType: EventType,
		eventData: Record<string, any>,
		memberId?: MongooseSchema.Types.ObjectId,
		metadata?: Record<string, any>,
	): Promise<AnalyticsEvent> {
		const event = new this.analyticsEventModel({
			eventType,
			eventData,
			memberId,
			metadata,
			timestamp: new Date(),
		});

		return await event.save();
	}

	/**
	 * Get count of active users in the last N minutes
	 */
	async getActiveUsersCount(minutesAgo: number = 5): Promise<number> {
		const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

		const activeUsers = await this.analyticsEventModel.distinct('memberId', {
			timestamp: { $gte: cutoffTime },
			memberId: { $ne: null },
		});

		return activeUsers.length;
	}

	/**
	 * Get detailed active users list
	 */
	async getActiveUsers(minutesAgo: number = 5): Promise<ActiveUser[]> {
		const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

		const pipeline = [
			{
				$match: {
					timestamp: { $gte: cutoffTime },
					memberId: { $ne: null },
				},
			},
			{
				$sort: { timestamp: -1 as -1 },
			},
			{
				$group: {
					_id: '$memberId',
					lastActivity: { $first: '$timestamp' },
					eventData: { $first: '$eventData' },
				},
			},
			{
				$limit: 10,
			},
		];

		const results = await this.analyticsEventModel.aggregate(pipeline);

		return results.map((r) => ({
			memberId: r._id.toString(),
			memberNick: r.eventData?.memberNick || 'Unknown',
			lastActivity: r.lastActivity,
		}));
	}

	/**
	 * Get sales velocity - top selling products in real-time
	 */
	async getSalesVelocity(limit: number = 5, hoursAgo: number = 1): Promise<SalesVelocityItem[]> {
		const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

		const pipeline = [
			{
				$match: {
					eventType: EventType.PRODUCT_PURCHASE,
					timestamp: { $gte: cutoffTime },
				},
			},
			{
				$group: {
					_id: '$eventData.productId',
					productName: { $first: '$eventData.productName' },
					salesCount: { $sum: 1 },
					lastSale: { $max: '$timestamp' },
				},
			},
			{
				$sort: { salesCount: -1 as -1 },
			},
			{
				$limit: limit,
			},
		];

		const results = await this.analyticsEventModel.aggregate(pipeline);

		return results.map((r) => ({
			productId: r._id,
			productName: r.productName || 'Unknown Product',
			salesCount: r.salesCount,
			lastSale: r.lastSale,
		}));
	}

	/**
	 * Get top performer - user with highest activity in the last hour
	 */
	async getTopPerformer(hoursAgo: number = 1): Promise<TopPerformer | null> {
		const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

		const pipeline = [
			{
				$match: {
					timestamp: { $gte: cutoffTime },
					memberId: { $ne: null },
				},
			},
			{
				$group: {
					_id: '$memberId',
					memberNick: { $first: '$eventData.memberNick' },
					activityCount: { $sum: 1 },
					recentActivities: { $push: '$eventType' },
				},
			},
			{
				$sort: { activityCount: -1 as -1 },
			},
			{
				$limit: 1,
			},
		];

		const results = await this.analyticsEventModel.aggregate(pipeline);

		if (results.length === 0) return null;

		const top = results[0];
		return {
			memberId: top._id.toString(),
			memberNick: top.memberNick || 'Unknown',
			activityCount: top.activityCount,
			recentActivities: top.recentActivities.slice(0, 5),
		};
	}

	/**
	 * Get recent activity feed
	 */
	async getRecentActivity(limit: number = 20): Promise<RecentActivity[]> {
		const events = await this.analyticsEventModel
			.find({
				eventType: {
					$in: [
						EventType.USER_LOGIN,
						EventType.USER_SIGNUP,
						EventType.PRODUCT_PURCHASE,
						EventType.PRODUCT_LIKE,
						EventType.COMMENT_CREATE,
					],
				},
			})
			.sort({ timestamp: -1 })
			.limit(limit)
			.lean();

		return events.map((event) => ({
			eventType: event.eventType,
			memberNick: event.eventData?.memberNick || 'Anonymous',
			timestamp: event.timestamp,
			description: this.formatEventDescription(event),
		}));
	}

	/**
	 * Format event description for display
	 */
	private formatEventDescription(event: any): string {
		const nick = event.eventData?.memberNick || 'Someone';
		const productName = event.eventData?.productName;

		switch (event.eventType) {
			case EventType.USER_LOGIN:
				return `${nick} logged in`;
			case EventType.USER_SIGNUP:
				return `${nick} joined PureRide`;
			case EventType.PRODUCT_PURCHASE:
				return `${nick} purchased ${productName || 'a product'}`;
			case EventType.PRODUCT_LIKE:
				return `${nick} liked ${productName || 'a product'}`;
			case EventType.COMMENT_CREATE:
				return `${nick} posted a comment`;
			case EventType.FOLLOW_USER:
				return `${nick} followed ${event.eventData?.targetNick || 'someone'}`;
			default:
				return `${nick} performed an action`;
		}
	}

	/**
	 * Get comprehensive analytics dashboard data
	 */
	async getDashboardAnalytics() {
		const [activeUsersCount, salesVelocity, topPerformer, recentActivity] = await Promise.all([
			this.getActiveUsersCount(5),
			this.getSalesVelocity(5, 1),
			this.getTopPerformer(1),
			this.getRecentActivity(15),
		]);

		return {
			activeUsersCount,
			salesVelocity,
			topPerformer,
			recentActivity,
			timestamp: new Date(),
		};
	}
}
