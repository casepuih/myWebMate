import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private logger = new Logger()
    constructor(){
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly'],
            refreshToken: true,
            accessType: 'offline',
            prompt: 'consent',
            // authorizationParams: {
            //     access_type: 'offline',
            // },
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        const { id, name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstname: name.givenName,
            lastname: name.familyName,
            picture: photos[0].value,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
        this.logger.debug(user)
        this.logger.debug(accessToken)
        this.logger.debug(refreshToken)
        done(null, user)
    }
}