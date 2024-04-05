import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus, UseInterceptors, ClassSerializerInterceptor, Logger, BadRequestException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { MembersService } from 'src/modules/members/members.service';
import { NotesResponseInterceptor } from './interceptors/notes-response.interceptor';

@Controller('notes')
export class NotesController {
  private logger = new Logger()
  constructor(
    private readonly notesService: NotesService,
    private readonly membersService: MembersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.id
    if (!userId){
      throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
    createNoteDto.member = userId
    this.logger.debug(createNoteDto)
    return this.notesService.create(createNoteDto);
  }

  // Get all notes in the db for control
  @Get('all')
  findAll() {
    return this.notesService.findAll();
  }

  // Get notes of the authenticated user
  @UseInterceptors(NotesResponseInterceptor, ClassSerializerInterceptor)
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
