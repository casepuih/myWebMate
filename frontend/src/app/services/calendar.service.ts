import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable, of, Subject, tap} from "rxjs";
import {Meet, ResAllMeet, ResAllTask, Task} from "../models/calendarModel";
import {environment} from "../../environments/environment";
import {DateEvent, Day} from "../models/dateModel";
import {Relation} from "../models/relationModel";
import {MemberService} from "./member.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  api:string = environment.api;
  private calendarUpdated = new Subject<any>();
  private monthChange = new Subject<boolean>();

  constructor(
    private _client : HttpClient,
    private _memberService : MemberService,
    private _errorService : ErrorService
  ) { }

  getCalendarUpdateEmitter() {
    return this.calendarUpdated.asObservable();
  }

  getMonthChangeEmitter() {
    return this.monthChange.asObservable();
  }

  emitMonthChange() {
    this.monthChange.next(!this.monthChange);
  }

  getAllPlanned() : Observable<[ResAllTask, ResAllMeet]> {
    return forkJoin([this._getAllTasks(), this._getAllMeets()]);
  }

  createTask(title:string, description:string, dateBeginObjet:DateEvent, recurrence:string, participant:Relation[]) :Observable<any> {
    const dateBegin : string = this._dateConstructorForAPI(dateBeginObjet);
    const isRecurring = recurrence !== "";
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.post<any>(this.api + "tasks", {
      title,
      description,
      dateBegin,
      isRecurring,
      recurrence,
      MemberIdArray
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  createMeet(title:string, description:string, dateBeginObjet:DateEvent, dateEndObjet:DateEvent, recurrence:string,
             participant:Relation[]) :Observable<any> {
    const dateBegin : string = this._dateConstructorForAPI(dateBeginObjet);
    const dateEnding : string = this._dateConstructorForAPI(dateEndObjet);
    const isRecurring = recurrence !== "";
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.post<any>(this.api + "meets", {
      title,
      description,
      dateBegin,
      dateEnding,
      isRecurring,
      recurrence,
      MemberIdArray
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  filterEventForThisMonth (planned : { tasks : Task[], meets : Meet[]}, month : Day[]) : Observable<any> {
    let monthWithEvent = this._createMonthWithEvent(month);
    monthWithEvent = this._pushTasksInMonthWithEvent(planned.tasks, monthWithEvent);
    monthWithEvent = this._pushMeetsInMonthWithEvent(planned.meets, monthWithEvent, month);

    return of(monthWithEvent);
  }

  private _createMonthWithEvent(month: Day[]) {
    const monthWithEvent = [];

    for (let i = 0; i < month.length; i++) {
      monthWithEvent.push({
        day: month[i].day,
        month: month[i].month,
        year: month[i].year,
        theDay: month[i].theDay,
        events: [{}]
      });
    }

    return monthWithEvent;
  }

  private _pushTasksInMonthWithEvent(tasks : Task[], monthWithEvent : any) {
    for (let i = 0; i < tasks.length; i++) {
      const dateBegin = new Date(tasks[i].dateBegin);
      monthWithEvent = this._pushTasksWithoutReccurenceInMonthWithEvent(tasks[i], monthWithEvent, dateBegin);

      if (tasks[i].isRecurring && dateBegin.getFullYear() <= monthWithEvent[0].year &&
      dateBegin.getMonth() + 1 <= monthWithEvent[0].month) {
        if (tasks[i].recurrence === "daily") {
          monthWithEvent = this._pushTasksWithDailyReccurenceInMonthWithEvent(tasks[i], monthWithEvent, dateBegin);
        }

        if (tasks[i].recurrence === "weekly") {
          monthWithEvent = this._pushTasksWithWeeklyReccurenceInMonthWithEvent(tasks[i], monthWithEvent, dateBegin);
        }

        if (tasks[i].recurrence === "monthly") {
          monthWithEvent = this._pushTasksWithMonthlyReccurenceInMonthWithEvent(tasks[i], monthWithEvent, dateBegin);
        }

        if (tasks[i].recurrence === "annual") {
          monthWithEvent = this._pushTasksWithAnnualReccurenceInMonthWithEvent(tasks[i], monthWithEvent, dateBegin);
        }
      }

    }

    return monthWithEvent;
  }

  private _pushTasksWithoutReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    if (!task.isRecurring && dateBegin.getFullYear() === monthWithEvent[0].year &&
      dateBegin.getMonth() + 1 === monthWithEvent[0].month) {
      monthWithEvent[dateBegin.getDate() - 1].events.push({
        id: task.id,
        title: task.title,
        description: task.description,
        dateBegin: task.dateBegin,
        isRecurring: task.isRecurring,
        recurrence: task.recurrence
      })
    }

    return monthWithEvent;
  }

  private _pushTasksWithDailyReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    let lowerLimit = 1;

    if (dateBegin.getMonth() + 1 === monthWithEvent[0].month) {
      lowerLimit = dateBegin.getDate();
    }

    const lowerLimitDate = new Date(monthWithEvent[0].year, monthWithEvent[0].month - 1, lowerLimit);
    const upperLimitDate = new Date(monthWithEvent[0].year, monthWithEvent[0].month, lowerLimit);
    upperLimitDate.setDate(0);

    for (let date = lowerLimitDate; date <= upperLimitDate; date.setDate(date.getDate() + 1)) {
      monthWithEvent[date.getDate() - 1].events.push({
        id: task.id,
        title: task.title,
        description: task.description,
        dateBegin: task.dateBegin,
        isRecurring: task.isRecurring,
        recurrence: task.recurrence
      })
    }

    return monthWithEvent;
  }

  private _pushTasksWithWeeklyReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    let lowerLimit = this._findTheFirstTheDayOfTheMonth(monthWithEvent, dateBegin);

    if (dateBegin.getMonth() + 1 === monthWithEvent[0].month) {
      lowerLimit = dateBegin.getDate();
    }

    const lowerLimitDate = new Date(monthWithEvent[0].year, monthWithEvent[0].month - 1, lowerLimit);
    const upperLimitDate = new Date(monthWithEvent[0].year, monthWithEvent[0].month, lowerLimit);
    upperLimitDate.setDate(0);

    for (let date = lowerLimitDate; date <= upperLimitDate; date.setDate(date.getDate() + 7)) {
      monthWithEvent[date.getDate() - 1].events.push({
        id: task.id,
        title: task.title,
        description: task.description,
        dateBegin: task.dateBegin,
        isRecurring: task.isRecurring,
        recurrence: task.recurrence
      })
    }

    return monthWithEvent;
  }

  private _pushTasksWithMonthlyReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    const upperLimit = this._findTheLastDayOfTheMonth(monthWithEvent, dateBegin);

    if (dateBegin.getDate() > upperLimit) {
      dateBegin.setDate(upperLimit);
    }

    monthWithEvent[dateBegin.getDate() - 1].events.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence
    })

    return monthWithEvent;
  }

  private _pushTasksWithAnnualReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    if (dateBegin.getMonth() + 1 === monthWithEvent[0].month) {
      monthWithEvent[dateBegin.getDate() - 1].events.push({
        id: task.id,
        title: task.title,
        description: task.description,
        dateBegin: task.dateBegin,
        isRecurring: task.isRecurring,
        recurrence: task.recurrence
      })
    }

    return monthWithEvent;
  }

  private _findTheFirstTheDayOfTheMonth (monthWithEvent : any, dateBegin : Date) {
    let firstTheDay= new Date(monthWithEvent[0].year, monthWithEvent[0].month - 1, 1);

    firstTheDay.setDate(1);
    while (firstTheDay.getDay() !== dateBegin.getDay()) {
      firstTheDay.setDate(firstTheDay.getDate() + 1);
    }

    return firstTheDay.getDate();
  }

  private _findTheLastDayOfTheMonth (monthWithEvent : any, dateBegin : Date) {
    let lastTheDay= new Date(monthWithEvent[0].year, monthWithEvent[0].month, 1);
    lastTheDay.setDate(0);

    return lastTheDay.getDate();
  }

  private _pushMeetsInMonthWithEvent(meets : Meet[], monthWithEvent : any, month: Day[]) {
    const firstDay = new Date(month[0].year, month[0].month -1, 1, 0, 0);
    const lastDay = new Date(month[0].year, month[0].month, 1, 23, 59, 59);
    lastDay.setDate(0);

    let dateBegin = new Date();
    let dateBeginTime = 0;
    let dateEnding = new Date();
    let dateEndingTime = 0;
    let dateTime = 0;

    console.log("LENGTH", meets.length);
    for (let i = 0; i < meets.length; i++) {
      console.log("BEGINBOUCLE OF MEETS", firstDay, lastDay);
      dateBegin = new Date (meets[i].dateBegin);
      dateBeginTime = dateBegin.getTime();
      dateEnding = new Date (meets[i].dateEnding);
      dateEndingTime = dateEnding.getTime();

      for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
        dateTime = date.getTime();

        console.log("FOR : ",meets[i].title, date," if (", dateTime, " >= ",dateBeginTime," && ",dateTime," <= ",dateEndingTime,")");
        if (dateTime >= dateBeginTime && dateTime <= dateEndingTime) {
          console.log(meets[i].title, date);
        }
      }

      console.log("IIIIIIIIIIIIIIII",i);

    }


    return monthWithEvent;
  }

  private _getAllTasks() : Observable<ResAllTask> {
    return this._client.get<ResAllTask>(this.api + "tasks");
  }

  private _getAllMeets() : Observable<ResAllMeet> {
    return this._client.get<ResAllMeet>(this.api + "meets");
  }

  private _getUserId() {
    const token = localStorage.getItem('auth_token');
    const base64Url = token!.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken.id;
  }

  private _fillMemberIdArray(userId : number, relation : Relation[]) {
    const MemberIdArray : number[] = []
    MemberIdArray.push(userId);

    for (let i=0; i<relation.length - 1;i++){
      if (relation[i].isChecked) {
        MemberIdArray.push(relation[i].id);
      }
    }

    return MemberIdArray;
  }

  private _dateConstructorForAPI(date:DateEvent) {
    return date.year + "-" + date.month + "-" + date.day + " " + date.hours + ":" + date.minutes + ":00";
  }

}
