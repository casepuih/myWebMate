import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { MembersService } from "src/modules/members/services/members.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private logger = new Logger()
    constructor(
        private readonly membersService: MembersService
    ){
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly'],
            refreshToken: true,
            accessType: 'offline',
            prompt: 'consent',
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        try {
            // TODO: ajouter en base le refreshToken
            const { name, emails, photos } = profile
            const user = {
                email: emails[0].value,
                firstname: name.givenName,
                lastname: name.familyName,
                picture: photos[0].value,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
            const member = await this.membersService.findByEmail(user.email)
            if (!member) {
                throw new UnauthorizedException('Cannot authenticate google acount')
            }
            await this.membersService.addGoogleAccessToken(member, user.accessToken)
            
            this.logger.debug(user)
            this.logger.debug(accessToken)
            this.logger.debug(refreshToken)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    }
}