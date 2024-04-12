import { Module } from '@nestjs/common';
import { LinksService } from './services/links.service';
import { LinksController } from './controllers/links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { LinkGroup } from './entities/link-group.entity';
import { MembersModule } from '../members/members.module';
import { MembersService } from '../members/services/members.service';
import { LinkGroupsService } from './services/link-groups.service';
import { LinkGroupsController } from './controllers/link-groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkGroup]), MembersModule],
  controllers: [LinksController, LinkGroupsController],
  providers: [LinksService, LinkGroupsService, MembersService],
})
export class LinksModule {}
