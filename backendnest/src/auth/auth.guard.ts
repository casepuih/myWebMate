import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // private readonly logger = new Logger(AuthGuard.name)

  constructor(private readonly authService: AuthService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const tokenParts = request.headers.authorization?.split(' ')
    if (!tokenParts || tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      return false;
    }

    const token = tokenParts[1]
    try {
      const decoded = this.authService.validateToken(token)
      request.user = decoded
      return true
    } catch (error) {
      return false
    }
  }
}
