import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as util from 'util'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    private logger = new Logger()
    async canActivate(context: ExecutionContext) {
        this.logger.debug('Entering google auth guard')
        const activate = await super.canActivate(context) as boolean
        this.logger.debug('Getting request')
        const request = context.switchToHttp().getRequest()
        this.logger.debug(util.inspect(request, { showHidden: false, depth: null }))
        await super.logIn(request)
        this.logger.debug(activate)
        return activate
    }
}