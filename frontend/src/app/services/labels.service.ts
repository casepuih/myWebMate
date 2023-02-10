import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Labels } from '../models/labelsModel';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  api: string = environment.api;
  private labelUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getLabelUpdateEmitter() {
    return this.labelUpdated.asObservable();
  }

  getLabelsList(): Observable<Labels> {
    return this._client.get<Labels>(this.api + "labels");
  }

  getOneLabel(id: number): Observable<any> {
    return this._client.get<any>(this.api + "labels/" + id);
  }

  updateLabel(title: string, content: string, id: number): Observable<any> {
    return this._client.put<any>(this.api + "labels/" + id, {
      title: title,
      color: content,
    }).pipe(tap(updatedLabel => {
      this.labelUpdated.next(updatedLabel);
    }));
  }

  deleteLabel(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "labels/" + id).pipe(tap(updatedLabel => {
      this.labelUpdated.next(updatedLabel);
    }));
  }

  createLabel(title: string, color: string): Observable<any> {
    return this._client.post<any>(this.api + "labels", {
      "title": title,
      "color": color
    }).pipe(tap(updatedLabel => {
      this.labelUpdated.next(updatedLabel);
    }));
  }
}
