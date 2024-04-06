import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Note } from 'src/modules/notes/entities/note.entity';
import { Invitation } from 'src/modules/invitations/entities/invitation.entity';
import { UpdateInvitationDto } from 'src/modules/invitations/dto/update-invitation.dto';

@Injectable()
export class MembersService {
  private logger = new Logger()
  constructor( 
    @InjectRepository(Member) 
    private readonly membersRepository: Repository<Member>,
  ){}

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
  
  async findOneWithFriends(id: number): Promise<Member> {
    return await this.membersRepository.findOne({ 
      where: {id: id}, 
      relations: ['friends'] })
  }

  async findSubsetById(memberIds: number[]): Promise<Member[]> {
    return await this.membersRepository.find({ 
      relations: ['friends'],
      where: { id: In(memberIds) },
    })
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async findByEmail(email: string): Promise<Member | null> {
    return await this.membersRepository.findOne({ where: { email } })
  }

  async findUserNotes(id: number): Promise<Note[]>{
    const user = await this.membersRepository.findOne({
      relations: ['notes'], 
      where: {id},
    })
    if (!user){ 
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.notes
  }

  async findUserFriends(id: number): Promise<Member[]> {
    const user = await this.membersRepository.findOne({
      relations: ['friends'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.friends
  }

  async addFriendship(updateInvitationDto: UpdateInvitationDto): Promise<boolean> {
    const [member1, member2] = await this.findSubsetById(Object.values(updateInvitationDto))
    if (!member1 || !member2){
      throw new NotFoundException(`Cannot create friendship`)
    }
    this.logger.debug(member1.friends.map(i => i.id))
    member1.friends.push(member2)
    member2.friends.push(member1)
    this.logger.debug(member1.friends.map(i => i.id))

    try {
      await this.membersRepository.save([member1, member2])
      this.logger.debug('Friendship saved in DB')
      return true
    } catch (error) {
      this.logger.debug('Error saving friendship: ', error)
      return false
    }
  }

  async findUserSentInvitations(id: number): Promise<Invitation[]> {
    const user = await this.membersRepository.findOne({
      relations: ['sentInvitations'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.sentInvitations
  }

  async findUserReceivedInvitations(id: number): Promise<Invitation[]> {
    const user = await this.membersRepository.findOne({
      relations: ['receivedInvitations', 'receivedInvitations.receiver'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.receivedInvitations
  }
}
