import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module'; // Import the AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
    AuthModule, // Include AuthModule in the imports array
  ],
  providers: [MemberResolver, MemberService],
  exports: [MemberService],
})
export class MemberModule {}
