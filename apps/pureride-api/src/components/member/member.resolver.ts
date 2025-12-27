import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import {
	getSerialForImage,
	getSerialForVideo,
	shapeIntoMongoObjectId,
	validMimeTypes,
	validVideoMimeTypes,
} from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Message } from '../../libs/enums/common.enum';
import { pipeline } from 'stream';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation:, signup');
		console.log('input:', input);
		return this.memberService.signup(input);
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation:, login');
		console.log('login input:', input);
		return this.memberService.login(input);
	}

	/* Authentication */
	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation:, updateMember');

		delete input._id;
		return this.memberService.updateMember(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		return `Hi ${memberNick}`;
	}

	@Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember('') authMember: Member): Promise<string> {
		console.log('Mutation:, checkAuthRoles');
		console.log('memberNick:=>', authMember);
		return `Hi ${authMember.memberNick}, you are ${authMember.memberType} ('memberId: ${authMember._id})`;
	}

	@UseGuards(WithoutGuard)
	@Query(() => Member)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query:, getMember');
		const targetId = shapeIntoMongoObjectId(input);
		return this.memberService.getMember(memberId, targetId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Members)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('GetAgents');
		return this.memberService.getAgents(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async likeTargetMember(
		@Args('memberId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: likeTargetMember');
		const likeRefId = shapeIntoMongoObjectId(input);
		return this.memberService.likeTargetMember(memberId, likeRefId);
	}

	// Only Admins are allowed to use!
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
	public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
		console.log('Mutation: getAllMembersByAdmin');
		return await this.memberService.getAllMembersByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member)
	public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
		console.log('Mutation: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}

	/** Uploader */
	// IMAGE UPLOADER (member.resolver.ts)

	@UseGuards(AuthGuard)
	@Mutation((returns) => String)
	public async imageUploader(
		@Args({ name: 'file', type: () => GraphQLUpload })
		{ createReadStream, filename, mimetype }: FileUpload,
		@Args('target') target: String,
	): Promise<string> {
		console.log('Mutation: imageUploader');

		if (!filename) throw new Error(Message.UPLOAD_FAILED);
		const validMime = validMimeTypes.includes(mimetype);
		if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_IMAGE_FORMAT);

		const imageName = getSerialForImage(filename);
		const url = `uploads/${target}/${imageName}`;
		const stream = createReadStream();

		const result = await new Promise((resolve, reject) => {
			stream
				.pipe(createWriteStream(url))
				.on('finish', async () => resolve(true))
				.on('error', () => reject(false));
		});
		if (!result) throw new Error(Message.UPLOAD_FAILED);

		return url;
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => [String])
	public async imagesUploader(
		@Args('files', { type: () => [GraphQLUpload] })
		files: Promise<FileUpload>[],
		@Args('target') target: String,
	): Promise<string[]> {
		console.log('Mutation: imagesUploader');

		const uploadedImages = [];
		const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
			try {
				const { filename, mimetype, encoding, createReadStream } = await img;

				const validMime = validMimeTypes.includes(mimetype);
				if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_IMAGE_FORMAT);

				const imageName = getSerialForImage(filename);
				const url = `uploads/${target}/${imageName}`;
				const stream = createReadStream();

				const result = await new Promise((resolve, reject) => {
					stream
						.pipe(createWriteStream(url))
						.on('finish', () => resolve(true))
						.on('error', () => reject(false));
				});
				if (!result) throw new Error(Message.UPLOAD_FAILED);

				uploadedImages[index] = url;
			} catch (err) {
				console.log('Error, file missing!');
			}
		});

		await Promise.all(promisedList);
		return uploadedImages;
	}

	@UseGuards(AuthGuard)
	@Mutation(() => String)
	async videoUploader(
		@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
		@Args('target') target: string,
	): Promise<string> {
		const { createReadStream, filename, mimetype } = file;

		if (!filename) throw new Error(Message.UPLOAD_FAILED);
		if (!validVideoMimeTypes.includes(mimetype.toLowerCase())) {
			throw new Error(Message.PROVIDE_ALLOWED_VIDEO_FORMAT);
		}

		const videoName = getSerialForVideo(filename);
		const url = `uploads/videos/${target}/${videoName}`;

		const stream = createReadStream();
		await pipeline(stream, createWriteStream(url));

		return url;
	}

	@UseGuards(AuthGuard)
	@Mutation(() => [String])
	async videosUploader(
		@Args('files', { type: () => [GraphQLUpload] }) files: Promise<FileUpload>[],
		@Args('target') target: string,
	): Promise<string[]> {
		const resolvedFiles = await Promise.all(files);
		const uploadedVideos: string[] = [];

		for (const file of resolvedFiles) {
			try {
				const { createReadStream, filename, mimetype } = file;

				if (!validVideoMimeTypes.includes(mimetype.toLowerCase())) {
					throw new Error(Message.PROVIDE_ALLOWED_VIDEO_FORMAT);
				}

				const videoName = getSerialForVideo(filename);
				const url = `uploads/videos/${target}/${videoName}`;

				const stream = createReadStream();
				await pipeline(stream, createWriteStream(url));

				uploadedVideos.push(url);
			} catch (err) {
				console.error('Video upload failed:', err);
			}
		}

		return uploadedVideos;
	}
	/** Helper: Save a single video with time tracking */
	private async saveVideo(file: FileUpload, target: string): Promise<{ url: string; duration: number }> {
		const { createReadStream, filename, mimetype } = file;

		if (!filename) throw new Error(Message.UPLOAD_FAILED);
		if (!validVideoMimeTypes.includes(mimetype.toLowerCase())) {
			throw new Error(Message.PROVIDE_ALLOWED_VIDEO_FORMAT);
		}

		const videoName = getSerialForVideo(filename);
		const url = `uploads/videos/${target}/${videoName}`;

		const stream = createReadStream();
		const startTime = Date.now();
		let uploadedBytes = 0;

		// Optional: progress logging
		stream.on('data', (chunk) => {
			uploadedBytes += chunk.length;
			// console.log(`Uploaded ${uploadedBytes} bytes for ${filename}`);
		});

		await pipeline(stream, createWriteStream(url));

		const duration = (Date.now() - startTime) / 1000; // seconds
		console.log(`Video ${filename} uploaded in ${duration.toFixed(2)} seconds`);

		return { url, duration };
	}
}
