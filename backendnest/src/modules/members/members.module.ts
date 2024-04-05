import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { FriendsController } from './friends.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Member])],
  controllers: [MembersController, FriendsController],
  providers: [MembersService],
  exports: [TypeOrmModule, MembersService]
})
export class MembersModule {}
