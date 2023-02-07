import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noteResume'
})
export class NoteResumePipe implements PipeTransform {

  transform(value: string): string {
    if (value.length > 120) {
      return value.substring(0, 120) + "......";
    }

    return value;
  }

}
