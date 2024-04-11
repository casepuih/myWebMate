import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MembersService } from 'src/modules/members/services/members.service';
import { MembersModule } from 'src/modules/members/members.module';
import { TokenGeneratorService } from './token-generator.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { NotepadModule } from '../notepad/notepad.module';
import { NotepadService } from '../notepad/notepad.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './serializers/session.serializer';

@Module({
  imports: [
    MembersModule,
    NotepadModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h'},
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    SessionSerializer,
    AuthService, 
    GoogleStrategy,
    MembersService,
    NotepadService, 
    TokenGeneratorService],
})
export class AuthModule {}
