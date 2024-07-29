import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	INQUIRY = 'INQUIRY',
}
registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});

export enum NoticeType {
	PROMOTION = 'PROMOTION',
	NEW_ARRIVAL = 'NEW ARRIVAL ',
	MAINTENANCE = 'MAINTENANCE',
	SAFETY = 'SAFETY',
	WEBSITE_UPDATE = 'WEBSITE UPDATE',
	LEGAL_POLICY = 'LEGAL POLICY',
	GENERAL_ANNOUNCEMENT = 'GENERAL ANNOUNCEMENT',
}
registerEnumType(NoticeType, {
	name: 'NoticeType',
});
