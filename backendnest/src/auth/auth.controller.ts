import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';
import { TokenGeneratorService } from './token-generator.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenGeneratorService: TokenGeneratorService
  ) {}

  @Post('register')
  register(@Body() createMemberDto: CreateMemberDto) {
    return this.authService.register(createMemberDto)
  }

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Post('jwt')
  async generateToken(@Body() credentials: { email: string, password: string}): Promise<{ access_token: string}> {
    const { email, password } = credentials;
    const token = await this.tokenGeneratorService.generateToken(email, password)
    return { access_token: token }
  }
}
