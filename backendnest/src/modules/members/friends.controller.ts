import { Controller, Get, Request } from "@nestjs/common";
import { MembersService } from "./members.service";

@Controller('friends')
export class FriendsController {
    constructor(private readonly membersService: MembersService) {}

    @Get()
    async getAllFriends(@Request() req){
        const userId = req.user.id
        return await this.membersService.findUserFriends(userId)
    }
    
}