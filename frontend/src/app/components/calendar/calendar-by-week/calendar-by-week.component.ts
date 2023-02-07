import { Component, OnInit, Input } from '@angular/core';
import {Day} from "../../../models/dateModel";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-week',
  templateUrl: './calendar-by-week.component.html',
  styleUrls: ['./calendar-by-week.component.scss'],
})
export class CalendarByWeekComponent implements OnInit {
  @Input() week!: Day[];
  allPlanned!: { tasks : Task[], meets : Meet[]};

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getAllPlanned();
    this.getEmitter();
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
