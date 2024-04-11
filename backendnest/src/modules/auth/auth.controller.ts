import { Body, Controller, Get, Logger, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from 'src/modules/members/dto/create-member.dto';
import { TokenGeneratorService } from './token-generator.service';
import { Public } from 'src/decorators/public.decorator';
import { NotepadService } from '../notepad/notepad.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger()
  constructor(
    private readonly authService: AuthService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly notepadService: NotepadService
  ) {}

  @Public()
  @Post('register')
  async register(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.authService.register(createMemberDto)
    this.logger.debug('Creating notepad')
    const notepad = await this.notepadService.create(member)
    this.logger.debug(notepad?.id)
    return member
  }

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @Post('jwt')
  async generateToken(@Body() credentials: { email: string, password: string}): Promise<string> {
    const { email, password } = credentials;
    const token = await this.tokenGeneratorService.generateToken(email, password)
    return token
  }

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.handlerLogin()
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return this.authService.handlerRedirect()
  }

  @Public()
  @Get('status')
  user(@Request() req) {
    if (req.user) {
      return { message: 'Authenticated', user: req.user }
    } else {
      return { message: 'Not Authenticated' }
    }
  }
}
