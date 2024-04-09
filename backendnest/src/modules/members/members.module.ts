import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { FriendsController } from './controllers/friends.controller';
import { FriendsService } from './services/friends.service';
import { NotepadModule } from '../notepad/notepad.module';
import { NotepadService } from '../notepad/notepad.service';

@Module({
  imports:[TypeOrmModule.forFeature([Member]), NotepadModule],
  controllers: [MembersController, FriendsController],
  providers: [MembersService, FriendsService, NotepadService],
  exports: [TypeOrmModule, MembersService]
})
export class MembersModule {}
