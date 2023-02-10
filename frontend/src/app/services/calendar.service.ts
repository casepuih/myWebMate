import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable, of, Subject, tap} from "rxjs";
import {Meet, ResAllMeet, ResAllTask, ResOneMeet, ResOneTask, Task} from "../models/calendarModel";
import {environment} from "../../environments/environment";
import {DateEvent, Day} from "../models/dateModel";
import {Relation} from "../models/relationModel";
import {MemberService} from "./member.service";
import {ErrorService} from "./error.service";
import {DateService} from "./date.service";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  api:string = environment.api;
  private calendarUpdated = new Subject<any>();
  private dayChange = new Subject<any>();
  private weekChange = new Subject<any>();
  private monthChange = new Subject<boolean>();
  private updateEventEmit = new Subject<[number, any]>();

  constructor(
    private _client : HttpClient,
    private _memberService : MemberService,
    private _errorService : ErrorService,
    private _dateService : DateService
  ) { }

  getCallUpdateEventEmitter() : Observable<[number, any]> {
    return this.updateEventEmit.asObservable();
  }

  callUpdateEventEmit(id : number, dateEnding : any) {
    this.updateEventEmit.next([id, dateEnding]);
  }

  getCalendarUpdateEmitter() {
    return this.calendarUpdated.asObservable();
  }

  getMonthChangeEmitter() {
    return this.monthChange.asObservable();
  }

  emitMonthChange() {
    this.monthChange.next(!this.monthChange);
  }

  getDayChangeEmitter() {
    return this.dayChange.asObservable();
  }

  emitDayChange() {
    this.dayChange.next(!this.dayChange);
  }

  getWeekChangeEmitter() {
    return this.weekChange.asObservable();
  }

  emitWeekChange() {
    this.weekChange.next(!this.weekChange);
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

  createMeet(title:string, description:string, dateBeginObjet:DateEvent, dateEndObjet:DateEvent, participant:Relation[]) :Observable<any> {
    const dateBegin : string = this._dateConstructorForAPI(dateBeginObjet);
    const dateEnding : string = this._dateConstructorForAPI(dateEndObjet);
    const isRecurring = false;
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.post<any>(this.api + "meets", {
      title,
      description,
      dateBegin,
      dateEnding,
      isRecurring,
      recurrence : "",
      MemberIdArray
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  filterEventForPlanning (planned : { tasks : Task[], meets : Meet[]}) : Observable<any> {
    let planningWithEvent = this._pushTasksInPlanningWithEvent(planned.tasks);
    planningWithEvent = this._pushMeetsInPlanningWithEvent(planned.meets, planningWithEvent);
    planningWithEvent = this._sortEventForPlanning(planningWithEvent);

    return of (planningWithEvent);
  }

  filterEventForThisMonth (planned : { tasks : Task[], meets : Meet[]}, month : Day[]) : Observable<any> {
    let monthWithEvent = this._createMonthWithEvent(month);
    monthWithEvent = this._pushTasksInMonthWithEvent(planned.tasks, monthWithEvent);
    monthWithEvent = this._pushMeetsInMonthWithEvent(planned.meets, monthWithEvent, month);

    return of(monthWithEvent);
  }

  filterEventForThisDay (planned : { tasks : Task[], meets : Meet[]}, day : Day) {
    let dayWithEvent : [{}] = [{}];
    dayWithEvent = this._pushTasksInDayWithEvent(planned.tasks, day, dayWithEvent);
    dayWithEvent = this._pushMeetsInDayWithEvent(planned.meets, dayWithEvent, day);
    dayWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);

    return of(dayWithEvent);
  }

  filterEventForThisWeek (planned : { tasks : Task[], meets : Meet[]}, week : Day[]) {
    let weekWithEvent = this._createWeekWithEvent(week);
    const dateBeginWeek = new Date (weekWithEvent[0].year, weekWithEvent[0].month - 1, weekWithEvent[0].day);
    const dateEndingWeek = new Date (weekWithEvent[6].year, weekWithEvent[6].month - 1, weekWithEvent[6].day);

    let i = 0;
    for (let date = dateBeginWeek; date <= dateEndingWeek; date.setDate(date.getDate() + 1)) {
      weekWithEvent = this._fillOneDayInOneWeek(planned, date, weekWithEvent, i);
      i++;
    }

    return of(weekWithEvent);
  }

  private _filterEventForOneDay (planned : { tasks : Task[], meets : Meet[]}, day : Day) {
    let dayWithEvent : [{}] = [{}];
    dayWithEvent = this._pushTasksInDayWithEvent(planned.tasks, day, dayWithEvent);
    dayWithEvent = this._pushMeetsInDayWithEvent(planned.meets, dayWithEvent, day);
    dayWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);

    return dayWithEvent;
  }

  getOneTask(id : number) : Observable<ResOneTask> {
    return this._client.get<ResOneTask>(this.api + "tasks/" + id);
  }

  getOneMeet(id : number) : Observable<ResOneMeet> {
    return this._client.get<ResOneMeet>(this.api + "meets/" + id);
  }

  private _fillOneDayInOneWeek(planned : { tasks : Task[], meets : Meet[]}, oneDay : Date, weekWithEvent : any, indexWeek : number) {
    const day = {
      day: oneDay.getDate(),
      month: oneDay.getMonth() + 1,
      year: oneDay.getFullYear(),
      theDay: this._dateService.makeTheDay(oneDay.getDay())
    }

    weekWithEvent[indexWeek].events = this._filterEventForOneDay(planned, day);

    return weekWithEvent;
  }

  private _pushTasksInDayWithEvent(tasks : Task[], day : Day, dayWithEvent : any) {
    const date = new Date(day.year, day.month - 1, day.day);
    const dateTimeDown = date.getTime();
    const dateTimeUp = dateTimeDown + 86400000;

    for (let i = 0; i < tasks.length; i++) {
      let dateBegin = new Date(tasks[i].dateBegin);
      let dateBeginTime = dateBegin.getTime();

      if (!tasks[i].isRecurring && (dateTimeDown <= dateBeginTime) && (dateTimeUp >= dateBeginTime)) {
        dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, tasks[i], day);
      }

      if (tasks[i].isRecurring) {
        dayWithEvent = this._createRecurrentTaskForDay(dayWithEvent, tasks[i], day);
      }
    }

    return dayWithEvent
  }

  private _pushOneTaskInDayWithEvent(dayWithEvent : any, task : Task, day : Day) {
    const dateBegin = new Date(task.dateBegin);
    const date = new Date(day.year, day.month, day.day, dateBegin.getHours(), dateBegin.getMinutes());
    const dateTimeEvent = date.getTime();

    dayWithEvent.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence,
      dateTime: dateTimeEvent
    })

    return dayWithEvent;
  }

  private _pushTasksInPlanningWithEvent(tasks : Task[]) {
    let planningWithEvent = [];
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    let date = new Date();
    let dateTime = 0;

    for (let i = 0; i < tasks.length; i++) {
      date = new Date(tasks[i].dateBegin);
      dateTime = date.getTime();

      if (tasks[i].isRecurring) {
        planningWithEvent = this._createRecurrentTaskForPlanning(planningWithEvent, tasks[i]);
      }

      if (dateTime > currentDateTime && !tasks[i].isRecurring) {
        planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, tasks[i], dateTime);
      }
    }

    return planningWithEvent;
  }

  private _createRecurrentTaskForDay(dayWithEvent : any , task : Task, day : Day){
    const date = new Date(day.year, day.month - 1, day.day);
    const dateTimeDown = date.getTime();
    const dateBegin = new Date(task.dateBegin);
    const dateBeginTime = dateBegin.getTime() - 86400000;

    if (task.recurrence === "daily") {
      dayWithEvent = this._createDailyRecurrentTaskForDay(dateTimeDown, dateBeginTime, dayWithEvent, task, day);
    }

    if (task.recurrence === "weekly") {
      dayWithEvent = this._createWeekRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);

    }

    if (task.recurrence === "monthly") {
      dayWithEvent = this._createMonthRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);
    }

    if (task.recurrence === "annual") {
      dayWithEvent = this._createAnnualRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);
    }

    return dayWithEvent;
  }

  private _createDailyRecurrentTaskForDay(dateTimeDown : number, dateBeginTime : number, dayWithEvent : any, task : Task, day : Day) {
    if ((dateTimeDown >= dateBeginTime)) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _createWeekRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    const dayDifference = this._dayDifference(date, dateBegin);
    if (dayDifference % 7 === 0) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _createMonthRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    if (date.getDate() === dateBegin.getDate()) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

      let targetDate = dateBegin.getDate();
      let targetMonth = date.getMonth();
      let targetYear = date.getFullYear();

      let daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      if (targetDate > daysInTargetMonth) {
        if (date.getDate() === daysInTargetMonth) {
          dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
        }
      }

    return dayWithEvent;
  }

  private _createAnnualRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    if (date.getDate() === dateBegin.getDate() && date.getMonth() == dateBegin.getMonth()) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _createRecurrentTaskForPlanning(planningWithEvent : any, task: Task) {
    let today = new Date();

    if (task.recurrence === "daily") {
      this._createDailyRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "weekly") {
      this._createWeekRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "monthly") {
      this._createMonthRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "annual") {
      this._createAnnualRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    return planningWithEvent;
  }

  private _createDailyRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 3 ; i++) {
      let dateBegin = new Date(task.dateBegin);

      let dateToPush = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      dateToPush.setDate(dateToPush.getDate() + i);
      let dateTimeToPush = dateToPush.getTime();

      if (task.title.substring(0, 19) !== "(Tout les jours) : ") {
        task.title = "(Tout les jours) : " + task.title
      }

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createWeekRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 12 ; i++) {
      let dateBegin = new Date(task.dateBegin);

      let dateToPush = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      let ajustDayOfTheWeek = dateBegin.getDay() - today.getDay();
      dateToPush.setDate(dateToPush.getDate() + ajustDayOfTheWeek);

      dateToPush.setDate(dateToPush.getDate() + (i * 7) );
      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createMonthRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    const dateBegin = new Date(task.dateBegin);
    const month = today.getMonth();
    const year = today.getFullYear();

    for (let i = 0; i < 13 ; i++) {
      let targetDate = dateBegin.getDate();
      let targetMonth = month + i;
      let targetYear = year;

      if (targetMonth > 12) {
        targetMonth = targetMonth - 12;
        targetYear++;
      }

      let daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      if (targetDate > daysInTargetMonth) {
        targetDate = daysInTargetMonth;
      }

      let dateToPush = new Date(targetYear, targetMonth, targetDate,
        dateBegin.getHours(), dateBegin.getMinutes());

      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createAnnualRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 1 ; i++) {
      const dateBegin = new Date(task.dateBegin);
      const dateBeginTime = dateBegin.getTime();
      let date = new Date();
      let dateTime = date.getTime();

      let dateToPush = new Date(dateBegin.getFullYear(), dateBegin.getMonth(), dateBegin.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      if (dateTime > dateBeginTime) {
        dateToPush = new Date(dateBegin.getFullYear() + 1, dateBegin.getMonth(), dateBegin.getDate(),
          dateBegin.getHours(), dateBegin.getMinutes());
      }

      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _pushOneTaskInPlanning(planningWithEvent : any, task : Task, dateTime : number, dateBegin? : Date) {
    if (dateBegin) {
      task.dateBegin = dateBegin;
    }

    planningWithEvent.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence,
      dateTime: dateTime
    })

    return planningWithEvent;
  }

  private _pushMeetsInPlanningWithEvent(meets : Meet[], planningWithEvent : any) {
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    let date = new Date();
    let dateTime = 0;
    let dateEnding = new Date();
    let dateTimeEnding = 0;

    for (let i = 0; i < meets.length; i++) {
      date = new Date(meets[i].dateBegin);
      dateTime = date.getTime();
      dateEnding = new Date(meets[i].dateEnding);
      dateTimeEnding = dateEnding.getTime();

      if ( (dateTimeEnding > currentDateTime && !meets[i].isRecurring) || meets[i].isRecurring ) {
        planningWithEvent.push({
          id: meets[i].id,
          title: meets[i].title,
          description: meets[i].description,
          dateBegin: meets[i].dateBegin,
          dateEnding: meets[i].dateEnding,
          isRecurring: meets[i].isRecurring,
          recurrence: meets[i].recurrence,
          dateTime: dateTime
        })
      }
    }

    return planningWithEvent;
  }

  private _sortEventForPlanning(planningWithEvent : any) {
    const date = new Date();
    const dateTime = date.getTime();

    planningWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);
    planningWithEvent = planningWithEvent.filter((event: { dateTime: number; }) => event.dateTime >= dateTime);

    return planningWithEvent;
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

  private _createWeekWithEvent(week: Day[]) {
    const weekWithEvent = [];

    for (let i = 0; i < week.length; i++) {
      weekWithEvent.push({
        day: week[i].day,
        month: week[i].month,
        year: week[i].year,
        theDay: week[i].theDay,
        events: [{}]
      });
    }

    return weekWithEvent;
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
      this._pushOneTaskInMonthWithEvent(task, monthWithEvent, dateBegin);
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
      this._pushOneTaskInMonthWithEvent(task, monthWithEvent, date);
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
      this._pushOneTaskInMonthWithEvent(task, monthWithEvent, date);
    }

    return monthWithEvent;
  }

  private _pushTasksWithMonthlyReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    const upperLimit = this._findTheLastDayOfTheMonth(monthWithEvent, dateBegin);

    if (dateBegin.getDate() > upperLimit) {
      dateBegin.setDate(upperLimit);
    }

    this._pushOneTaskInMonthWithEvent(task, monthWithEvent, dateBegin);

    return monthWithEvent;
  }

  private _pushTasksWithAnnualReccurenceInMonthWithEvent(task : Task, monthWithEvent : any, dateBegin : Date) {
    if (dateBegin.getMonth() + 1 === monthWithEvent[0].month) {
      this._pushOneTaskInMonthWithEvent(task, monthWithEvent, dateBegin);
    }

    return monthWithEvent;
  }

  private _pushOneTaskInMonthWithEvent(task : Task, monthWithEvent : any, date : Date) {
    monthWithEvent[date.getDate() - 1].events.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence
    })
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

  private _pushMeetsInDayWithEvent(meets : Meet[], dayWithEvent : any, day: Day) {
    const thisDay = new Date(day.year, day.month - 1, day.day);
    const thisDayTime = thisDay.getTime();
    let beginTime!:Date;
    let endingTime!:Date;
    let beginTimespan!:number;
    let endingTimespan!:number;
    let date!:Date;
    let dateTime!:number;

    for (let i = 0; i < meets.length; i++) {
      beginTime = new Date(meets[i].dateBegin);
      endingTime = new Date(meets[i].dateEnding);
      beginTimespan = beginTime.getTime() - 86400000;
      endingTimespan = endingTime.getTime();
      date = new Date(day.year, day.month, day.day, beginTime.getHours(), beginTime.getMinutes());
      dateTime = date.getTime();
      if (thisDayTime > beginTimespan && thisDayTime <= endingTimespan) {
        dayWithEvent.push({
          id: meets[i].id,
          title: meets[i].title,
          description: meets[i].description,
          dateBegin: meets[i].dateBegin,
          dateEnding: meets[i].dateEnding,
          isRecurring: meets[i].isRecurring,
          recurrence: meets[i].recurrence,
          dateTime: dateTime
        })
      }
    }

    return dayWithEvent;
  }

  private _pushMeetsInMonthWithEvent(meets : Meet[], monthWithEvent : any, month: Day[]) {
    let firstDay = new Date(month[0].year, month[0].month -1, 1, 0, 0, 0);
    const lastDay = new Date(month[0].year, month[0].month, 1, 23, 59, 59);
    lastDay.setDate(0);

    let dateBegin = new Date();
    let dateBeginTime = 0;
    let dateEnding = new Date();
    let dateEndingTime = 0;
    let dateTime = 0;

    for (let i = 0; i < meets.length; i++) {
      firstDay = new Date(month[0].year, month[0].month -1, 1, 0, 0, 0);
      dateBegin = new Date (meets[i].dateBegin);
      dateBeginTime = dateBegin.getTime();
      dateEnding = new Date (meets[i].dateEnding);
      dateEndingTime = dateEnding.getTime();

      for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
        dateTime = date.getTime() +86399000;

        if (dateTime >= dateBeginTime && dateTime <= dateEndingTime) {
          monthWithEvent[date.getDate() - 1].events.push({
            id: meets[i].id,
            title: meets[i].title,
            description: meets[i].description,
            dateBegin: meets[i].dateBegin,
            dateEnding: meets[i].dateEnding,
            isRecurring: meets[i].isRecurring,
            recurrence: meets[i].recurrence
          })
        }
      }
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

  private _dayDifference (first : Date, second : Date) {
    const one = new Date(first).getTime();
    const two = new Date(second).getTime();
    const difference_ms = Math.abs(one - two);

    return Math.round(difference_ms/86400000);
  }

}
