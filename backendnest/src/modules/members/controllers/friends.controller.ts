import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Request, UseInterceptors } from "@nestjs/common";
import { MembersService } from "../services/members.service";
import { CreateInvitationDto } from "../../invitations/dto/create-invitation.dto";
import { InvitationsService } from "../../invitations/invitations.service";
import { FriendsService } from "../services/friends.service";

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly membersService: MembersService,
        private readonly friendsService: FriendsService,
        private readonly invitationsService: InvitationsService
    ) {}

    @Get()
    async getAllFriends(@Request() req){
        const userId = req.user.id
        return await this.membersService.findUserFriends(userId)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('invitation')
    async sendInvitation(@Request() req, @Body() createInvitationDto: CreateInvitationDto){
        try {
            const userId = req.user.id
            createInvitationDto.senderId = userId
            const createInvitationDtoWithMembers = await this.friendsService.sendFriendshipInvitation(createInvitationDto)
            return await this.invitationsService.create(createInvitationDtoWithMembers) 
        } catch (error) {
            throw error
        }
    }
    
}