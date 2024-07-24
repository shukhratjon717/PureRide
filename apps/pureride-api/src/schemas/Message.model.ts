import { Schema } from 'mongoose';
import { CommentGroup, CommentStatus } from '../libs/enums/comment.enum';
import { MessageStatus } from '../libs/enums/message.enum';

const MessageSchema = new Schema(
	{
		messageStatus: {
			type: String,
			enum: MessageStatus,
			default: MessageStatus.ACTIVE,
		},

		messageGroup: {
			type: String,
			enum: CommentGroup,
			required: true,
		},

        commentContent: {
			type: String,
			required: true,
		},

		messageRefId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true, collection: 'messages' },
);

export default MessageSchema;
