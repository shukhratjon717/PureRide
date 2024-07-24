import { registerEnumType } from "@nestjs/graphql";

export enum MessageStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(MessageStatus, {
	name: 'CommentStatus',
});

export enum MessageGroup {
	MEMBER = 'MEMBER',
	AGENT = 'AGENT',
}
registerEnumType(MessageGroup, {
	name: 'CommentGroup',
});
