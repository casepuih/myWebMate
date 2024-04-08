import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeetsService } from './meets.service';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';

@Controller('meets')
export class MeetsController {
  constructor(private readonly meetsService: MeetsService) {}

  @Post()
  create(@Body() createMeetDto: CreateMeetDto) {
    return this.meetsService.create(createMeetDto);
  }

  @Get()
  findAll() {
    return this.meetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetDto: UpdateMeetDto) {
    return this.meetsService.update(+id, updateMeetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetsService.remove(+id);
  }
}
