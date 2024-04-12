import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLinkDto } from '../dto/link/create-link.dto';
import { UpdateLinkDto } from '../dto/link/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '../entities/link.entity';
import { Repository } from 'typeorm';
import { MembersService } from 'src/modules/members/services/members.service';
import { LinkGroupsService } from './link-groups.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly linkGroupsService: LinkGroupsService,
    private readonly membersService: MembersService
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    const { member, linksGroupId, ...rest } = createLinkDto
    const link = await this.linksRepository.create(rest)
    if (member) {
      const memberInstance = await this.membersService.findOne(member)
      link.member = memberInstance
    }
    if (linksGroupId) {
      const linksGoup = await this.linkGroupsService.findOne(linksGroupId)
      link.linkGroup =  linksGoup
    }
    return await this.linksRepository.save(link)
  }

  async findAllByMemberId(id: number): Promise<Link[]> {
    return await this.linksRepository.find({ where: { member: { id: id } } })
  }

  async findAllByLinkGroupId(id: number): Promise<Link[]> {
    return await this.linksRepository.find({ where: { linkGroup: { id: id } } })
  }

  async findOne(id: number) {
    const link = await this.linksRepository.findOne({ where: {id}})
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    return link
  }

  async update(id: number, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if(!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    Object.assign(link, updateLinkDto)
    return await this.linksRepository.save(link)
  }

  async remove(id: number): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if (!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    return await this.linksRepository.remove(link)
  }

  async clickOnLink(id: number, userId: number): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if (!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    if (link.MemberId !== userId) {
      throw new UnauthorizedException(`User with ID ${userId} cannot modify this link`)
    }
    link.clickedCounter += 1
    return await this.linksRepository.save(link)
  }
}
