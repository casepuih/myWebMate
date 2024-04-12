import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request } from "@nestjs/common";
import { LinkGroupsService } from "../services/link-groups.service";
import { CreateLinkGroupDto } from "../dto/linkGroup/create-link-group.dto";
import { UpdateLinkGroupDto } from "../dto/linkGroup/update-link-group.dto";

@Controller('linksgroup')
export class LinkGroupsController {
    constructor(private readonly linkGroupsService: LinkGroupsService) {}

    @Post()
    async create(@Request() req, @Body() createLinkGroupDto: CreateLinkGroupDto) {
        const userId = req.user.id
        if (!userId){
          throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
        }
        createLinkGroupDto.member = userId
        return await this.linkGroupsService.create(createLinkGroupDto);
    }

    @Get()
    async findAllByMemberId(@Request() req) {
        const userId = req.user.id
        const linkGroups = await this.linkGroupsService.findAllByMemberId(userId)
        return { results: { linksGroup: linkGroups }}
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.linkGroupsService.findOne(+id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateLinkGroupDto: UpdateLinkGroupDto) {
        return await this.linkGroupsService.update(+id, updateLinkGroupDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.linkGroupsService.remove(+id);
    }

}