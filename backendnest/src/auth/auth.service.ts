import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MembersService } from 'src/members/members.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly membersService: MembersService,
        private readonly jwtService: JwtService
    ){}

    async register(createMemberDto: CreateMemberDto){
        return this.membersService.create(createMemberDto)
    }

    async signIn(email: string, password: string): Promise<any> {
        const member = await this.membersService.findByEmail(email);
        if (!member){
            throw new NotFoundException(`User with email '${email}' not found`);
        }

        if (!(await bcrypt.compare(password, member.hashPassword))){
            throw new UnauthorizedException();
        }

        const payload = { id: member.id, email: member.email}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    validateToken(token: string): any {
        try {
            return this.jwtService.verify(token)
        } catch (error) {
            return null
        } 
    }
}
