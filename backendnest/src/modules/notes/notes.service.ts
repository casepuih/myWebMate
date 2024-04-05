import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from 'src/modules/members/services/members.service';

@Injectable()
export class NotesService {
  constructor( 
    @InjectRepository(Note) 
    private readonly notesRepository: Repository<Note>,
    private readonly membersService: MembersService
  ){}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { member, sharedWith, ...rest } = createNoteDto;
    const note = this.notesRepository.create(rest);

    if (member) {
      const memberInstance = await this.membersService.findOne(member)
      note.member = memberInstance
    }

    if (sharedWith){
      const sharewWithMembers = await this.membersService.findSubsetById(sharedWith)
      note.sharedWith = sharewWithMembers
    }

    return this.notesRepository.save(note)
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find()
  }

  async findAllByMemberId(id: number): Promise<Note[]> {
    return await this.notesRepository.find({ where: { member: { id: id } } })
  }

  async findOne(id: number): Promise<Note> {
    return await this.notesRepository.findOne({ where: {id} })
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  async remove(id: number) {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note){
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    return await this.notesRepository.remove(note)
  }
}
