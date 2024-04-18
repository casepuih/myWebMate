import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meet } from './entities/meet.entity';
import { Repository } from 'typeorm';
import { MembersService } from '../members/services/members.service';

@Injectable()
export class MeetsService {
  constructor( 
    @InjectRepository(Meet) 
    private readonly meetsRepository: Repository<Meet>,
    private readonly membersService: MembersService
  ){}
  
  async create(createMeetDto: CreateMeetDto): Promise<Meet> {
    const { member, MemberIdArray, ...rest } = createMeetDto;
    const meet = this.meetsRepository.create(rest);
    if (member) {
      const memberInstance = await this.membersService.findOne(member); 
      meet.member = memberInstance;
    }
    if (MemberIdArray){
      const sharewWithMembers = await this.membersService.findSubsetById(MemberIdArray)
      meet.sharedWith = sharewWithMembers
    }

    return await this.meetsRepository.save(meet)
  }

  async findOne(id: number): Promise<Meet> {
    const meet = await this.meetsRepository.findOne({ where: {id} })
    if (!meet) {
      throw new NotFoundException(`Meet with ID ${id} not found`)
    }
    return meet
  }

  async update(id: number, updateMeetDto: UpdateMeetDto): Promise<Meet> {
    const meet = await this.findOne(id)

    const sharedWith = updateMeetDto.MemberIdArray
    if (sharedWith) {
      const sharewWithMembers = await this.membersService.findSubsetById(sharedWith)
      meet.sharedWith = sharewWithMembers
    }
    Object.assign(meet, updateMeetDto)
    return await this.meetsRepository.save(meet)
  }

  async remove(id: number): Promise<Meet> {
    const meet = await this.findOne(id)
    return await this.meetsRepository.remove(meet)
  }
}
