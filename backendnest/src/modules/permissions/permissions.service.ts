import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembersService } from '../members/services/members.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) 
    private readonly permissionsRepository: Repository<Permission>,
    private readonly membersService: MembersService,
    private readonly notesService: NotesService
  ){}

  async create(createPermissionDto: CreatePermissionDto) {
    const { memberId, noteId, level } = createPermissionDto

    const member = await this.membersService.findOne(memberId)
    if (!member) {
      throw new NotFoundException(`User with ID ${memberId} not found`)
    }

    const note = await this.notesService.findOne(noteId)
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`)
    }

    const permission = new Permission()
    permission.level = level
    permission.member = member
    permission.note = note
    return await this.permissionsRepository.save(permission)
  }

  async findAllByMemberId(id: number) {
    return await this.permissionsRepository.find({
      where: {
        member: {id:id}
      }
    })
  }

  async findOne(id: number) {
    return await this.permissionsRepository.findOne(({ where: {id} }))
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findOne(({ where: {id} }))
    Object.assign(permission, updatePermissionDto)
    return await this.permissionsRepository.save(permission)
  }

  async remove(id: number) {
    const permission = await this.permissionsRepository.findOne(({ where: {id} }))
    if (!permission){
      throw new NotFoundException(`Permission with ID ${id} not found`)
    }
    return await this.permissionsRepository.remove(permission)
  }
}
