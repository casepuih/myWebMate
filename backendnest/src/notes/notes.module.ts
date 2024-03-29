import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MembersService } from 'src/members/members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { MembersModule } from 'src/members/members.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), MembersModule],
  controllers: [NotesController],
  providers: [NotesService, MembersService, AuthService],
})
export class NotesModule {}
