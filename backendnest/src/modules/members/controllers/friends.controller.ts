import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { MembersService } from "../services/members.service";
import { CreateInvitationDto } from "../../invitations/dto/create-invitation.dto";
import { InvitationsService } from "../../invitations/invitations.service";

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly membersService: MembersService,
        private readonly invitationsService: InvitationsService
    ) {}

    @Get()
    async getAllFriends(@Request() req){
        const userId = req.user.id
        return await this.membersService.findUserFriends(userId)
    }

    @Post()
    async sendInvitation(@Request() req, @Body() createInvitationDto: CreateInvitationDto){
        // const userId = req.user.id
        // createInvitationDto.senderId = userId
        // return await this.invitationsService.create(createInvitationDto)
    }
    
}