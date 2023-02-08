import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {Notes} from "../models/notesModel";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  api:string = environment.api;
  private noteUpdated = new Subject<any>();

  constructor(
    private _client : HttpClient
  ) { }

  getNoteUpdateEmitter() {
    return this.noteUpdated.asObservable();
  }

  getNotesList () : Observable<Notes> {
    return this._client.get<Notes>(this.api + "notes");
  }

  getOneNote (id: number) : Observable<any> {
    return this._client.get<any>(this.api + "notes/" + id);
  }

  updateNote (title: string, content:string, id: number) : Observable<any> {
    return this._client.put<any>(this.api + "notes/" + id, {
      title : title,
      content : content
    }).pipe(tap(updatedNote => {
      this.noteUpdated.next(updatedNote);
    }));
  }

  deleteNote(id:number) : Observable<any> {
    return this._client.delete<any>(this.api + "notes/" + id).pipe(tap(updatedNote => {
      this.noteUpdated.next(updatedNote);
    }));
  }

  createNote(title:string) : Observable<any> {
    return this._client.post<any>(this.api + "notes", {
      "title" : title,
      "content" : ""
    }).pipe(tap(updatedNote => {
      this.noteUpdated.next(updatedNote);
    }));
  }

  createNoteFull(title:string, content:string) : Observable<any> {
    return this._client.post<any>(this.api + "notes", {
      "title" : title,
      "content" : content
    }).pipe(tap(updatedNote => {
      this.noteUpdated.next(updatedNote);
    }));
  }

}
