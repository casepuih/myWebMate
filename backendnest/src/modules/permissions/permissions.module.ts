import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '../members/members.module';
import { NotesModule } from '../notes/notes.module';
import { MembersService } from '../members/services/members.service';
import { NotesService } from '../notes/notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), MembersModule, NotesModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, MembersService, NotesService],
})
export class PermissionsModule {}
