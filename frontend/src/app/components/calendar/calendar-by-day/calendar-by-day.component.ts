import {Component, Input, OnInit} from '@angular/core';
import {Day} from "../../../models/dateModel";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-day',
  templateUrl: './calendar-by-day.component.html',
  styleUrls: ['./calendar-by-day.component.scss'],
})
export class CalendarByDayComponent implements OnInit {
  @Input() day!: Day;
  allPlanned!: { tasks : Task[], meets : Meet[]};

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getEmitter();
    this.getAllPlanned();
  }

  getEmitter() {
    this._calendarService.getCalendarUpdateEmitter().subscribe( {
      next: () => {
        this.getAllPlanned();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getAllPlanned() {
    this._calendarService.getAllPlanned().subscribe({
      next: (data) => {
        this.allPlanned = { tasks : data[0].result.tasks, meets : data[1].result.meets };
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
