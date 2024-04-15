import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { Event } from './event.interface';

@Injectable()
export class GoogleCalendarService {
    private calendar = google.calendar('v3')
    private logger = new Logger()

    constructor() {
        const auth = new google.auth.OAuth2()
        auth.setCredentials({
            access_token: 'ya29.a0Ad52N3_SnF6Qf6OcWzADjB5F5oy5nnRziahMXLheJca94mLK_79HYby1U280J3dUTNcZkQj4JAUR9BTSrpo7dNC41dl68kM9RNQ2a9TQO0djGLr2Dzsx3uHyu-BVZQt3zlwN9xHy3z-ixfTUL0DcrqVVPhTIJ1qlg18-aCgYKAfwSARMSFQHGX2Miogp3Uy4dJ8W5QfliTg1p3Q0171'
        })
        this.calendar = google.calendar({ version: 'v3', auth})
    }

    async getEvents(calendarId: string, options: any = {}): Promise<Event[]> {
        try {
            const response = await this.calendar.events.list({
                calendarId,
                ...options
            })
            return response.data.items
        } catch (error) {
            this.logger.debug('Error fecthing events: ', error)
            throw error
        }
    }
}
