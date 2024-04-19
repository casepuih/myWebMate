import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { In, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Note } from 'src/modules/notes/entities/note.entity';
import { Invitation } from 'src/modules/invitations/entities/invitation.entity';
import { UpdateInvitationDto } from 'src/modules/invitations/dto/update-invitation.dto';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Meet } from 'src/modules/meets/entities/meet.entity';

@Injectable()
export class MembersService {
  private logger = new Logger()
  constructor( 
    @InjectRepository(Member) 
    private readonly membersRepository: Repository<Member>,
  ){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const hashPassword = await bcrypt.hash(createMemberDto.password, 10)
      const member = this.membersRepository.create(createMemberDto)
      member.hashPassword = hashPassword
      return await this.membersRepository.save(member)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Email address already exists')
        this.logger.debug(error.detail)
      }
      throw error
    }
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

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.membersRepository.findOne({ where: {id} })
    if (!member) {
      throw new NotFoundException('Member not found')
    }

    member.firstname = updateMemberDto?.firstname ?? member.firstname
    member.lastname = updateMemberDto?.lastname ?? member.lastname

    if (updateMemberDto?.oldPassword && updateMemberDto?.newPassword) {
      if (!(await bcrypt.compare(updateMemberDto.oldPassword, member.hashPassword))) {
        throw new BadRequestException('Wrong old password')
      }
      const hashPassword = await bcrypt.hash(updateMemberDto.newPassword, 10)
      member.hashPassword = hashPassword
    }

    member.email = updateMemberDto?.newEmail ?? member.email

    return this.membersRepository.save(member)
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async addGoogleAccessToken(member: Member, accessToken: string): Promise<void> {
    try {
      member.googleAccessToken = accessToken
      await this.membersRepository.save(member)
    } catch (error) {
      throw new Error('Failed to add Google access token')
    }
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

  async findUserTasks(id: number): Promise<Task[]> {
    const user = await this.membersRepository.findOne({
      relations: ['tasks'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.tasks
  }

  async findUserMeets(id: number): Promise<Meet[]> {
    const user = await this.membersRepository.findOne({
      relations: ['meets'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.meets
  }

  async isFriendsWith(id: number, friendId: number): Promise<boolean> {
    const member = await this.findOneWithFriends(id)
    return member.friends.some(friend => friend.id === friendId)
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

  /**
   * Deletes member2 from member1.friends list and vice versa
   * @param updateInvitationDto 
   * @returns 
   */
  async deleteFriendship(updateInvitationDto: UpdateInvitationDto): Promise<boolean> {
    const member1 = await this.findOneWithFriends(updateInvitationDto.receiverId)
    if (!member1) {
      throw new NotFoundException(`User with ID ${updateInvitationDto.receiverId} not found`)
    }
    const member2 = await this.findOneWithFriends(updateInvitationDto.senderId)
    if (!member2) {
      throw new NotFoundException(`User with ID ${updateInvitationDto.senderId} not found`)
    }

    const isFriendsWith = await this.isFriendsWith(member1.id, member2.id)
    if (!isFriendsWith) {
      throw new NotFoundException('The friendship cannot be deleted because it does not exist !')
    }

    try {
      // Delete member from the friends list of the other member
      member1.friends = member1.friends.filter(friend => friend.id !== member2.id)
      member2.friends = member2.friends.filter(friend => friend.id !== member1.id)
      await this.membersRepository.save([member1, member2])
      return true
    } catch (error) {
      this.logger.debug('Error deleting friendship: ', error)
      throw error
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
      relations: ['receivedInvitations', 'receivedInvitations.sender'], 
      where: {id},
    })
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user.receivedInvitations
  }
}
