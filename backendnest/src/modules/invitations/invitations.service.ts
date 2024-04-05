import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { MembersService } from '../members/services/members.service';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>
  ){}

  async create(sender: Member, receiver: Member) {
    // const receiver = await this.membersService.findByEmail(createInvitationDto.receiverInvitationEmail)
    // if (!receiver) {
    //   throw new NotFoundException(`User with ID ${(receiver).id} not found`)
    // }
    // const sender = await this.membersService.findOne(createInvitationDto.senderId)
    // if (!sender) {
    //   throw new NotFoundException(`User with ID ${(sender).id} not found`)
    // }
    const invitation = new Invitation()
    invitation.receiver = receiver
    invitation.sender = sender
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
