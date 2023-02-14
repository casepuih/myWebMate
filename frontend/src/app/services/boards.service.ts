import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Boards } from '../models/boardsModel';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  api: string = environment.api;
  private boardUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getBoardUpdateEmitter() {
    return this.boardUpdated.asObservable();
  }

  getBoardsList(): Observable<Boards> {
    return this._client.get<Boards>(this.api + "boards");
  }

  getOneBoard(id: number): Observable<any> {
    return this._client.get<any>(this.api + "boards/" + id);
  }

  // getBoardsFromProject(projectId: number): Observable<any> {
  //   return this._client.get<Boards>(this.api + "boards").pipe(map(boards => {
  //     return boards.result.boards.filter(board => board.projectId == projectId)
  //   }))
  // }

  updateBoard(title: string, content: string, id: number): Observable<any> {
    return this._client.put<any>(this.api + "boards/" + id, {
      title: title,
    }).pipe(tap(updatedBoard => {
      this.boardUpdated.next(updatedBoard);
    }));
  }

  deleteBoard(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "boards/" + id).pipe(tap(updatedBoard => {
      this.boardUpdated.next(updatedBoard);
    }));
  }

  createBoard(title: string): Observable<any> {
    return this._client.post<any>(this.api + "boards", {
      "title": title,
    }).pipe(tap(updatedBoard => {
      this.boardUpdated.next(updatedBoard);
    }));
  }
}
