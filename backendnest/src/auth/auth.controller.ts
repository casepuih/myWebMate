import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  register(@Body() createMemberDto: CreateMemberDto) {
    return this.authService.register(createMemberDto)
  }

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }
}
