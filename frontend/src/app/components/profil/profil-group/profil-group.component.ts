import { Component, OnInit } from '@angular/core';
import { GroupMember } from 'src/app/models/groupsMembersModel';
import { Group } from 'src/app/models/groupsModel';
import { Member } from 'src/app/models/memberModel';
import { ErrorService } from 'src/app/services/error.service';
import { GroupsService } from 'src/app/services/groups.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-profil-group',
  templateUrl: './profil-group.component.html',
  styleUrls: ['./profil-group.component.scss'],
})
export class ProfilGroupComponent implements OnInit {
  groupList!: Array<Group>;
  memberList!: Array<Member>;
  groupsMembersList!: Array<GroupMember>
  // Formulaire 1
  groupName!: string;
  // Formulaire 2
  selectMemberId!: number;
  selectGroupId!: number;
  selectIsAdmin!: boolean;
  selectTier!: number;
  //


  constructor(
    private _groupsService: GroupsService,
    private _memberService: MemberService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getGroupList();
    this.getMemberList();
    this.getGroupMemberList();
  }

  gName() {
    console.log(this.groupsMembersList);

    this.groupName = ""
  }

  createGroupMember() {
    this._groupsService.createGroupMember(this.selectIsAdmin, this.selectTier, this.selectGroupId, this.selectMemberId).subscribe({})
  }

  getGroupList() {
    this._groupsService.getGroupList().subscribe({
      next: (data) => {
        this.groupList = data.results.groups;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getMemberList() {
    this._memberService.getAllProfil().subscribe({
      next: (data) => {
        this.memberList = data.result.members;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getGroupMemberList() {
    this._groupsService.getGroupsMemebersList().subscribe({
      next: (data) => {
        this.groupsMembersList = data.results.groupsMembers;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
