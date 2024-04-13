import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, UseInterceptors, Logger, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { MembersService } from 'src/modules/members/services/members.service';
import { NotesResponseInterceptor } from './interceptors/notes-response.interceptor';
import { BaseResponseInterceptor } from 'src/interceptors/base-response.interceptor';

// @UseInterceptors(BaseResponseInterceptor)
@Controller('notes')
export class NotesController {
  private logger = new Logger()
  constructor(
    private readonly notesService: NotesService,
    private readonly membersService: MembersService,
  ) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.id
    if (!userId){
      throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
    createNoteDto.member = userId
    this.logger.debug(createNoteDto)
    const note = await this.notesService.create(createNoteDto)
    return { result: note }
  }

  // Get all notes in the db for control
  @Get('all')
  findAll() {
    return this.notesService.findAll();
  }

  // Get notes of the authenticated user
  @UseInterceptors(NotesResponseInterceptor)
  @Get()
  async findAllNotesByMemberId(@Request() req){
    try {
      const userId = req.user.id
      const notes = await this.membersService.findUserNotes(userId)
      if (!notes){
        return new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
      }
      return notes
    } catch (error) {
      return new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
  }

  @UseInterceptors(NotesResponseInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const note = await this.notesService.findOne(+id)
    return note 
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return await this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.notesService.remove(+id);
  }
}
