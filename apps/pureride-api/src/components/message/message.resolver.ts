import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MessageService } from './message.service';
import { MessageInput, MessagesInquiry } from '../../libs/dto/message/message.input';
import { MessageUpdate } from '../../libs/dto/message/message.update';
import { AgentMessage, AgentMessages } from '../../libs/dto/message/message';
import { Message } from '../../libs/enums/common.enum';

@Resolver()
export class MessageResolver {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => AgentMessage)
	public async createMessage(
		@Args('input') input: MessageInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AgentMessage> {
		console.log('Mutation: createComment ');
		return await this.messageService.createMessage(memberId, input);
	}

	@Mutation((returns) => AgentMessage)
	public async updateMessage(
		@Args('input') input: MessageUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AgentMessage> {
		console.log('Mutation: updateComment ');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.messageService.updateMessage(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => AgentMessages)
	public async getMessages(
		@Args('input') input: MessagesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AgentMessages> {
		console.log('Mutation: getComments ');
		input.search.messageRefId = shapeIntoMongoObjectId(input.search.messageRefId);
		return await this.messageService.getMessages(memberId, input);
	}
	@UseGuards(RolesGuard)
	@Mutation((returns) => AgentMessage)
	public async removeMessage(@Args('messageId') input: string): Promise<AgentMessage> {
		console.log('Mutation: removeCommentByAdmin');
		const messageId = shapeIntoMongoObjectId(input);
		return await this.messageService.removeMessage(messageId);
	}
}
