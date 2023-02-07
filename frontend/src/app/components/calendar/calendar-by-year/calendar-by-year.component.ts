import {Component, Input, OnInit} from '@angular/core';
import {Day} from "../../../models/dateModel";
import {DateService} from "../../../services/date.service";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-year',
  templateUrl: './calendar-by-year.component.html',
  styleUrls: ['./calendar-by-year.component.scss'],
})
export class CalendarByYearComponent implements OnInit {
  @Input() year!: Day[][];
  allPlanned!: { tasks : Task[], meets : Meet[]};
  currentYear!: number;

  constructor(
    private _dateService : DateService,
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getYear();
    this.getAllPlanned();
    this.getEmitter();
    console.log(this.allPlanned);
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
        console.log(this.allPlanned);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getYear() {
    this._dateService.getYearObservable().subscribe({
      next: (data) => {
        this.currentYear = data;
      }
    });
  }
}
