import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Commentaries } from '../models/commentariesModel';

@Injectable({
  providedIn: 'root'
})
export class CommentariesService {
  api: string = environment.api;
  private commentariesUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getCommentariesUpdateEmitter() {
    return this.commentariesUpdated.asObservable();
  }

  getCommentariesList(): Observable<Commentaries> {
    return this._client.get<Commentaries>(this.api + "commentaries");
  }

  createCommentary(commentary: string): Observable<any> {
    return this._client.post<any>(this.api + "commentaries", {
      "commentary": commentary,
    }).pipe(tap(updatedCommentaries => {
      this.commentariesUpdated.next(updatedCommentaries);
    }))
  }

  updateCommentary(id: number, commentary: string): Observable<any> {
    return this._client.put<any>(this.api + "commentaries/" + id, {
      "commentary": commentary,
    }).pipe(tap(updatedCommentaries => {
      this.commentariesUpdated.next(updatedCommentaries);
    }))
  }

  deleteCommentary(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "commentaries/" + id).pipe(tap(updatedCommentaries => {
      this.commentariesUpdated.next(updatedCommentaries);
    }))
  }
}
