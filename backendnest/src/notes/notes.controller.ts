import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { MembersService } from 'src/members/members.service';
import { FormatResponseInterceptor } from './interceptors/format-response/format-response.interceptor';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly membersService: MembersService,
  ) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  // Get all notes in the db for control
  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    return this.notesService.findAll();
  }

  // Get notes of the authenticated user
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor, ClassSerializerInterceptor)
  @Get()
  findAllNotesByMemberId(@Request() req){
    try {
      const userId = req.user.id
      const notes = this.membersService.findUserNotes(userId)
      if (!notes){
        return new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
      }
      return notes
    } catch (error) {
      return new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
