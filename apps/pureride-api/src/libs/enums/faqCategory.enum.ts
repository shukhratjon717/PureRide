import { registerEnumType } from '@nestjs/graphql';

export enum FaqStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(FaqStatus, {
	name: 'FaqStatus',
});

export enum FaqType {
	PRODUCT = 'PRODUCT',
	PAYMENT = 'PAYMENT',
	BUYERS = 'BUYERS',
	AGENTS = 'AGENTS',
	MEMBERSHIP = 'MEMBERSHIP',
	COMMUNITY = 'COMMUNITY',
	OTHER = 'OTHER',
}

registerEnumType(FaqType, {
	name: 'FaqCategory',
});
