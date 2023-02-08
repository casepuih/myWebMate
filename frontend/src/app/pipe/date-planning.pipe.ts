import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePlanning'
})

export class DatePlanningPipe implements PipeTransform {

  transform(value: string): string {
    const dateEvent = new Date(value);
    const date = `${this.zerotage(dateEvent.getDate())}/${this.zerotage(dateEvent.getMonth()+1)}/${this.zerotage(dateEvent.getFullYear())}`;
    const hours = `${this.zerotage(dateEvent.getHours())}H${this.zerotage(dateEvent.getMinutes())}`;

    return `${date} ${hours}`;
  }

  zerotage(number: number): string {
    if (number === 0) return "00";
    if (number === 1) return "01";
    if (number === 2) return "02";
    if (number === 3) return "03";
    if (number === 4) return "04";
    if (number === 5) return "05";
    if (number === 6) return "06";
    if (number === 7) return "07";
    if (number === 8) return "08";
    if (number === 9) return "09";

    return number.toString();
  }

}
