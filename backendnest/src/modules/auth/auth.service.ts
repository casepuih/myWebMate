import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MembersService } from 'src/modules/members/services/members.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateMemberDto } from 'src/modules/members/dto/create-member.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class AuthService {
    private logger = new Logger()
    constructor(
        private readonly membersService: MembersService,
        private readonly jwtService: JwtService,
    ){}

    async register(createMemberDto: CreateMemberDto){
        return await this.membersService.create(createMemberDto)
    }

    async signIn(email: string, password: string): Promise<any> {
        const member = await this.membersService.findByEmail(email);
        if (!member){
            throw new NotFoundException(`User with email '${email}' not found`);
        }

        if (!(await bcrypt.compare(password, member.hashPassword))){
            throw new UnauthorizedException('Bad Credential');
        }

        const payload = { id: member.id, email: member.email}
        return {
            id: member.id,
            token: await this.jwtService.signAsync(payload)
        }
    }

    validateToken(token: string): any {
        try {
            return this.jwtService.verify(token)
        } catch (error) {
            return null
        } 
    }

    async validateUser(email: string, displayName: string): Promise<Member> {
        const user = await this.membersService.findByEmail(email)
        if (user) {
            return user
        }
    }

    async findUser(id: number): Promise<Member> {
        return await this.membersService.findOne(id)
    }

    handlerLogin() {
        return 'Coucou google'
        // if (!req.user){
        //     return 'No user from Google'
        // }
        // return {
        //     message: 'User information from google',
        //     user: req.user
        // }
    }

    handlerRedirect() {
        return 'handlerRedirect'
    }
}
