import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Request, Logger, Put } from '@nestjs/common';
import { MeetsService } from './meets.service';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { BaseResponseInterceptor } from 'src/interceptors/base-response.interceptor';
import { MembersService } from '../members/services/members.service';

@UseInterceptors(BaseResponseInterceptor)
@Controller('meets')
export class MeetsController {
  private logger = new Logger()
  constructor(
    private readonly meetsService: MeetsService,
    private readonly membersService: MembersService
  ) {}

  @Post()
  async create(@Request() req, @Body() createMeetDto: CreateMeetDto) {
    const userId = req.user.id
    createMeetDto.member = userId
    return await this.meetsService.create(createMeetDto);
  }

  @Get()
  async findAllByMemberId(@Request() req) {
    const userId = req.user.id
    const meets = await this.membersService.findUserMeets(userId)
    return { meets: meets }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const meet = await this.meetsService.findOne(+id)
    return { meet: [meet] }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMeetDto: UpdateMeetDto) {
    return await this.meetsService.update(+id, updateMeetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetsService.remove(+id);
  }
}
