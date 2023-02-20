import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Groups } from "../models/groupsModel";
import { GroupsMembers } from "../models/groupsMembersModel";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  api: string = environment.api;
  private groupsUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getLinksUpdateEmitter() {
    return this.groupsUpdated.asObservable();
  }

  getGroupList(): Observable<Groups> {
    return this._client.get<Groups>(this.api + "groups");
  }

  getGroupsMemebersList(): Observable<GroupsMembers> {
    return this._client.get<GroupsMembers>(this.api + "groupsMembers");
  }

  createGroup(name: string): Observable<any> {
    return this._client.post<any>(this.api + "groups", {
      "name": name,
      "description": "description manuelle"
    }).pipe(tap(updatedGroups => {
      this.groupsUpdated.next(updatedGroups);
    }))
  }

  createGroupMember(isAdmin: string, tier: number, groupId: number, memberId: number): Observable<any> {
    return this._client.post<any>(this.api + "groupsMembers", {
      "isAdmin": isAdmin,
      "tier": tier,
      "groupId": groupId,
      "memberId": memberId,
    }).pipe(tap(updatedGroups => {
      this.groupsUpdated.next(updatedGroups);
    }))
  }

  updateLink(id: number, name: string, description: string): Observable<any> {
    return this._client.put<any>(this.api + "groups/" + id, {
      "name": name,
      "description": description
    }).pipe(tap(updatedGroups => {
      this.groupsUpdated.next(updatedGroups);
    }))
  }

  deleteLink(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "groups/" + id).pipe(tap(updatedGroups => {
      this.groupsUpdated.next(updatedGroups);
    }))
  }
}
