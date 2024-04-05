import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>
  ){}

  async create(createInvitationDto: CreateInvitationDto) {
    const invitation = new Invitation()
    invitation.receiver = createInvitationDto.receiver
    invitation.sender = createInvitationDto.sender
    return await this.invitationsRepository.save(invitation)
  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
