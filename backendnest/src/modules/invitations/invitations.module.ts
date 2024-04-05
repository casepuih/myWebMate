import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { Invitation } from './entities/invitation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  providers: [InvitationsService],
  exports: [TypeOrmModule, InvitationsService]
})
export class InvitationsModule {}
