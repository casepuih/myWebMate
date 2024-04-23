import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from '../members/services/members.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { Meet } from './entities/meet.entity';
import { UnifiedMeet } from './dto/unified-meet.dto';

@Injectable()
export class MeetsService {
  private logger = new Logger()
  constructor( 
    @InjectRepository(Meet) 
    private readonly meetsRepository: Repository<Meet>,
    private readonly membersService: MembersService,
    private readonly googleCalendarService: GoogleCalendarService
  ){}
  
  // Local meets
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

  /**
   * Find all meets based in on the user id
   * @param id 
   */
  async findAllMeets(id: number): Promise<UnifiedMeet[]> {
    const dbMeets = await this.meetsRepository.find({ where: { member: { id: id } } })
    const googleMeets = await this.getGoogleMeets(id)

    this.logger.debug(dbMeets)
    const dbMeetsWithSource: UnifiedMeet[] = dbMeets.map(dbMeet => {
      const mappedMeet: Partial<UnifiedMeet> = {...dbMeet, source:'local'}
      return mappedMeet as UnifiedMeet
    })

    const allMeets = [...dbMeetsWithSource, ...googleMeets]
    return allMeets
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

  // Google meets 
  async getGoogleMeets(userId: number): Promise<UnifiedMeet[]> {
    const user = await this.membersService.findOne(userId)
    const googleAccessToken = user.googleAccessToken

    // User has not synced google calendar
    if (!googleAccessToken) {
      return []
      // throw new UnauthorizedException('Cannot fetch Google Meets of the user')
    }
    const events = await this.googleCalendarService.getEvents(googleAccessToken)
    
    // Transform Google Meets into Meet object to fit local meets
    const googleMeets: UnifiedMeet[] = events.map((googleEvent) => {
      return {
        id: undefined,
        title: googleEvent.summary,
        description: googleEvent.description,
        dateBegin: this.getDate(googleEvent.start),
        dateEnding: this.getDate(googleEvent.end),
        isRecurring: !!googleEvent.recurrence,
        recurrence: this.extractFrequency(googleEvent.recurrence),
        source: 'google'
      }
    })

    return googleMeets
  }

  private getDate(eventStart: { date?: string, dateTime?: string}): Date {
    if (!eventStart) {
      throw new Error('Invalid start/end date/time: Missing start/end object.')
    }

    if (eventStart.dateTime) {
      return new Date(eventStart.dateTime)
    } else if (eventStart.date) {
      return new Date(eventStart.date + 'T00:00:00')
    } else {
      throw new Error('Invalid start/end date/time.')
    }
  }

  private extractFrequency(rrule: string[]): string {
    if (!rrule) {
      return ''
    }
    return ''
  }
}
