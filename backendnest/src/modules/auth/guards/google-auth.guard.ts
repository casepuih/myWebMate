import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    private logger = new Logger()
    async canActivate(context: ExecutionContext) {
        this.logger.debug('Entering google auth guard')
        const activate = await super.canActivate(context) as boolean
        const request = context.switchToHttp().getRequest()
        await super.logIn(request)
        return activate
    }
}