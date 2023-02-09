import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projects } from '../models/projectsModel';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  api: string = environment.api;
  private projectUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getProjectUpdateEmitter() {
    return this.projectUpdated.asObservable();
  }

  getProjectsList(): Observable<Projects> {
    return this._client.get<Projects>(this.api + "projects");
  }

  getOneProject(id: number): Observable<any> {
    return this._client.get<any>(this.api + "projects/" + id);
  }

  updateProject(title: string, content: string, id: number): Observable<any> {
    return this._client.put<any>(this.api + "projects/" + id, {
      title: title,
      content: content
    }).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }

  deleteProject(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "projects/" + id).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }

  createProject(title: string): Observable<any> {
    return this._client.post<any>(this.api + "projects", {
      "title": title,
      "description": ""
    }).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }
}
