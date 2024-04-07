import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, Request, Put } from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { BaseResponseInterceptor } from 'src/interceptors/base-response.interceptor';

@UseInterceptors(BaseResponseInterceptor)
@Controller('member')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.membersService.create(createMemberDto);
  }

  @Get()
  async findAuthenticatedMember(@Request() req) {
    const userId = req.user.id
    return await this.membersService.findOne(userId);
  }

  @Put('email/:id')
  async updateEmail(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto){
    return await this.membersService.update(+id, updateMemberDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membersService.findOne(+id);
  }

  @Post(':id')
  async updatePassword(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto){
    return await this.membersService.update(+id, updateMemberDto)
  }

  @Put(':id')
  async updateName(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto){
    return await this.membersService.update(+id, updateMemberDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.membersService.remove(+id);
  }


}
