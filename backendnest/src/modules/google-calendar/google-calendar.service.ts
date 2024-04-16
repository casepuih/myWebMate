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
            access_token: 'ya29.a0Ad52N39obeNrseF8tNOh6SgSUua-1BNn1aWDph2-NQxzHuJBk9O6fCdIOT7EYz2l40u9ZB2XRBwICqYz0aLTaPnGqgdw8dBj-EzahIKw24M-isBhCEibgz6o9lHcXI0scyS0oiluqSczsdoZoo-m7TWHZ_yQlJw7HwaCgYKAWESARMSFQHGX2Mitd9A2L-6yBy6y6kvu-laoQ0169'
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
