import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { FriendsController } from './controllers/friends.controller';
import { InvitationsModule } from '../invitations/invitations.module';
import { InvitationsService } from '../invitations/invitations.service';
import { FriendsService } from './services/friends.service';

@Module({
  imports:[TypeOrmModule.forFeature([Member]), InvitationsModule],
  controllers: [MembersController, FriendsController],
  providers: [MembersService, InvitationsService, FriendsService],
  exports: [TypeOrmModule, MembersService]
})
export class MembersModule {}
