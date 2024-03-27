import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MembersService } from 'src/members/members.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [
    MembersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MembersService],
})
export class AuthModule {}
