import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Request } from '@nestjs/common';
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

  @Post('email/:id')
  updateEmail(@Param('id') id: string){
    // TODO: implement Email update
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  @Post(':id')
  updatePassword(@Param('id') id: string){
    // TODO: implement password update
  }
}
