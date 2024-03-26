import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor( @InjectRepository(Member) private readonly membersRepository: Repository<Member>){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const hashPassword = await bcrypt.hash(createMemberDto.password, 10);
    const member = this.membersRepository.create(createMemberDto)
    member.hashPassword = hashPassword
    return await this.membersRepository.save(member)
  }

  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find()
  }

  async findOne(id: number): Promise<Member> {
    return await this.membersRepository.findOne({ where: {id} })
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
