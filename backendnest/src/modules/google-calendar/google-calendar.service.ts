import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { Event } from './event.interface';

@Injectable()
export class GoogleCalendarService {
    private calendar = google.calendar('v3')
    private logger = new Logger()

    constructor() {
        this.calendar = google.calendar({ version: 'v3'})
    }

    async getEvents(googleAccessToken: string, calendarId: string = 'primary', options: any = {}): Promise<Event[]> {
        try {
            const auth = new google.auth.OAuth2()
            auth.setCredentials({ access_token: googleAccessToken})
            const calendar = google.calendar({ version: 'v3', auth })
            const response = await calendar.events.list({
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
