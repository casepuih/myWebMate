import { Controller, Get } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';

@Controller('google')
export class GoogleCalendarController {
    constructor(
        private readonly googleCalendarService: GoogleCalendarService
    ){}

    @Get('events')
    async getEvents() {
        return await this.googleCalendarService.getEvents('primary')
    }
}
