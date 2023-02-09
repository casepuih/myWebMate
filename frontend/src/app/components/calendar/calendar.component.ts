import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DateService} from "../../services/date.service";
import {ErrorService} from "../../services/error.service";
import {DateEvent, Day} from "../../models/dateModel";
import {CalendarService} from "../../services/calendar.service";
import {RelationService} from "../../services/relation.service";
import {Relation} from "../../models/relationModel";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  today!:string;
  day!:Day;
  week!:Day[];
  month!:Day[];
  year!:Day[][];
  displayBy:string = "week";
  displayScrollAddMenu:boolean = false;
  displayFriendsPicker:boolean = false;
  relation:Relation[]=[];
  classTaskChoose : string = "selected";
  classMeetChoose : string = "pointer";
  listDay : number[] = [];
  listMonth : number[] = [];
  listYear : number[] = [];
  listHour : number[] = [];
  listMinute : number[] = [];
  participant! : Relation[];
  titleEvent!:string;
  recurrence:string = "";
  descriptionEvent:string = "";
  dateBegin!:DateEvent;
  dateEnd!:DateEvent;
  currentYear!: number;

  constructor(
    private _dateService: DateService,
    private _errorService: ErrorService,
    private _calendarService : CalendarService,
    private _relationService : RelationService,
    private _alertService : AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getWeek();
    this.fillFormAddEvent();
    this.getAllRelation();
  }

  getAllRelation() {
    this._relationService.getAllRelation().subscribe({
      next: (data) => {
        this.relation = data.result.friends;
        this.participant = data.result.friends;
        for (let i=0; i<this.participant.length; i++) {
          this.participant[0].isChecked = false;
        }
      },
      error: (error) =>{
        this._errorService.errorHandler(error);
      }
    })
  }

  createEvent() {
    if (this.titleEvent === "" || !this.titleEvent) {
      this._alertService.alerte("Titre manquant","Vous devez entrer un titre");

      return;
    }

    if (this.classTaskChoose === "selected") {
      this._calendarService.createTask(this.titleEvent, this.descriptionEvent, this.dateBegin, this.recurrence,
        this.participant).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }

    if (this.classMeetChoose === "selected") {
      this._calendarService.createMeet(this.titleEvent, this.descriptionEvent, this.dateBegin, this.dateEnd,
        this.participant).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }
  }

  clearFormAddEvent() {
    this.displayScrollAddMenu = false;
    this.titleEvent = "";
    this.descriptionEvent = "";
    this.recurrence = "";
    this.getAllRelation();
  }

  // gestion des dates
  getDay() {
    this.day = this._dateService.getDay();
    this.currentYear = this.day.year;
  }

  getWeek() {
    this.week = this._dateService.getWeek();
    this.currentYear = this.week[0].year;
  }

  getMonth() {
    this.month = this._dateService.getMonth();
    this.currentYear = this.month[0].year;
  }

  getYear() {
    this.year = this._dateService.getYear();
    this.currentYear = this.year[0][0].year;
  }

  getNext(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getNextDay();
      this.cdr.detectChanges();
      this._calendarService.emitDayChange();
      this.currentYear = this.day.year;
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getNextWeek();
      this.currentYear = this.week[0].year;
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getNextMonth();
      this.cdr.detectChanges();
      this._calendarService.emitMonthChange();
      this.currentYear = this.month[0].year;
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getNextYear();
      this.currentYear = this.year[0][0].year;
    }
  }

  getPrevious(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getPreviousDay();
      this.cdr.detectChanges();
      this._calendarService.emitDayChange();
      this.currentYear = this.day.year;
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getPreviousWeek();
      this.currentYear = this.week[0].year;
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getPreviousMonth();
      this.cdr.detectChanges();
      this._calendarService.emitMonthChange();
      this.currentYear = this.month[0].year;
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getPreviousYear();
      this.currentYear = this.year[0][0].year;
    }
  }

  getReturnToday(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getReturnTodayForDay();
      this.cdr.detectChanges();
      this._calendarService.emitDayChange();
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getReturnTodayForWeek();
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getReturnTodayForMonth();
      this.cdr.detectChanges();
      this._calendarService.emitMonthChange();
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getReturnTodayForYear();
    }
  }

  updateDisplayBy(value: string) {
    if (this.displayBy === "day") this.getDay();
    if (this.displayBy === "week") this.getWeek();
    if (this.displayBy === "month") this.getMonth();
    if (this.displayBy === "year") this.getYear();

    this.displayBy = value;
  }

  // display

  chooseAddTask() {
    this.classTaskChoose = "selected";
    this.classMeetChoose = "pointer";
  }

  chooseAddMeet() {
    this.classTaskChoose = "pointer";
    this.classMeetChoose = "selected";
  }

  fillFormAddEvent() {
    for (let i=1; i<32; i++) {
      this.listDay.push(i);
    }

    for (let i=1; i<13; i++) {
      this.listMonth.push(i);
    }

    const date = new Date();
    const thisYear = date.getFullYear();

    for (let i=thisYear; i<thisYear+40; i++) {
      this.listYear.push(i);
    }

    for (let i=0; i<24; i++) {
      this.listHour.push(i);
    }

    for (let i=0; i<60; i++) {
      this.listMinute.push(i);
    }

    this.dateBegin = {
      day:1,
      month:1,
      year:2023,
      hours:12,
      minutes:0
    };

    this.dateEnd = {
      day:1,
      month:1,
      year:2023,
      hours:12,
      minutes:0
    };

  }

  displayAddMenu() {
    this.displayScrollAddMenu = true;
  }

  hideAddMenu() {
    this.displayScrollAddMenu = false;
  }

  hideFriendsPicker() {
    this.displayFriendsPicker = false;
  }

  showFriendsPicker() {
    this.displayFriendsPicker = true;
  }
}
