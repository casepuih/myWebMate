import { Controller, Get, HttpStatus } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';

@Controller('google')
export class GoogleCalendarController {
    constructor(
        private readonly googleCalendarService: GoogleCalendarService
    ){}

    @Get('events')
    async getEvents() {
        const events = await this.googleCalendarService.getEvents('primary')
        return { 
            result: events,
            status: HttpStatus.OK
        }
    }
}
