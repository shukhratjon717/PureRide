import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';

// Main business logic
@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) {}

  public async signup(input: MemberInput): Promise<Member> {
    //TODO: Hash Password

    try {
      const result = await this.memberModel.create(input);
      //TODO: Authentication via Token
      return result;
    } catch (err) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
  }
  public async login(input: LoginInput): Promise<Member> {
    const { memberNick, memberPassword } = input;
    const response: Member = await this.memberModel
      .findOne({ memberNick: memberNick })
      .select(' +memberPasword')
      .exec();

    if (!response || response.memberStatus === MemberStatus.DELETE) {
      throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
    } else if (response.memberStatus === MemberStatus.BLOCK) {
      throw new InternalServerErrorException(Message.BLOCKED_USER);
    }

    // TODO: Compare passwords

    const isMatch = memberPassword === response.memberPassword;
    if (!isMatch)
      throw new InternalServerErrorException(Message.WRONG_PASSWORD);

    return response;
  }
  public async updateMember(): Promise<string> {
    return 'updateMember executed!';
  }
  public async getMember(): Promise<string> {
    return 'getMember executed!';
  }
}