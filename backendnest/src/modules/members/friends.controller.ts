import { Controller, Get } from "@nestjs/common";
import { MembersService } from "./members.service";

@Controller('friends')
export class FriendsController {
    constructor(private readonly membersService: MembersService) {}
    
}