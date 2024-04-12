import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, Put } from '@nestjs/common';
import { LinksService } from '../services/links.service';
import { CreateLinkDto } from '../dto/link/create-link.dto';
import { UpdateLinkDto } from '../dto/link/update-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  async create(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    const userId = req.user.id
    if (!userId){
      throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
    createLinkDto.member = userId
    return await this.linksService.create(createLinkDto);
  }

  @Get()
  async findAllByMemberId(@Request() req) {
    const userId = req.user.id
    const links = await this.linksService.findAllByMemberId(userId)
    return { 
      results: {
        links: links 
      },
      count: links.length
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.linksService.findOne(+id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return await this.linksService.update(+id, updateLinkDto);
  }

  @Post(':id')
  async clickOnLink(@Param('id') id: string, @Request() req) {
    const userId = req.user.id
    const link = await this.linksService.clickOnLink(+id, userId)
    return { 
      results: {
        links: [link] 
      },
      count: 1
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.linksService.remove(+id);
  }
}
