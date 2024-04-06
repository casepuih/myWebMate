import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Request, UseInterceptors } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { MembersService } from "../members/services/members.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";
import { BaseResponseInterceptor } from "src/interceptors/base-response.interceptor";

@UseInterceptors(BaseResponseInterceptor)
@Controller('friends')
export class InvitationsController {
    private logger = new Logger()
    constructor(
        private readonly invitationsService: InvitationsService,
        private readonly membersService: MembersService
    ){}

    // FRIENDS RELATED ROUTES
    @Get()
    async getAllFriends(@Request() req){
        try {
            const userId = req.user.id
            const friends =  await this.membersService.findUserFriends(userId)
            return { friends: friends}
        } catch (error) {
            throw error
        }
    }

    @Delete(':id')
    async deleteFriendship(@Request() req, @Param('id') id: string) {
        //TODO: deleteFriendship
    }

    // INVITATION RELATED ROUTES
    @Get('invitation')
    async findAllInvitations(@Request() req) {
        //TODO :
        const userId = req.user.id
        
    }

    @Post('invitation')
    async sendInvitation(@Request() req, @Body() createInvitationDto: CreateInvitationDto){
        try {
            const userId = req.user.id
            createInvitationDto.senderId = userId
            return await this.invitationsService.sendInvitation(createInvitationDto)
        } catch (error) {
            throw error
        }
    }

    @Put('invitation/:id')
    async acceptInvitation(@Request() req, @Param('id') id: string) {
        try {
            const userId = req.user.id
            const updateInvitationDto = new UpdateInvitationDto()
            updateInvitationDto.receiverId = userId
            updateInvitationDto.senderId = +id
            return await this.invitationsService.acceptInvitation(updateInvitationDto)  
        } catch (error) {
            throw error
        }
    }

    @Post('invitation/:id')
    async refuseInvitation(@Request() req, @Param('id') id: string){
        this.logger.debug('Entering refuseInvitation route')
        try {
            const userId = req.user.id
            const updateInvitationDto = new UpdateInvitationDto()
            updateInvitationDto.receiverId = userId
            updateInvitationDto.senderId = +id
            return await this.invitationsService.refuseInvitation(updateInvitationDto)
        } catch (error) {
            throw error
        }
    }

    @Delete('invitation/:id')
    async deleteInvitation(@Request() req, @Param('id') id: string) {
        const userId = req.user.id
        const updateInvitationDto = new UpdateInvitationDto()
        updateInvitationDto.receiverId = userId
        updateInvitationDto.senderId = +id
        await this.invitationsService.deleteInvitation(updateInvitationDto)
        return 'Deletion completed'
    }


}