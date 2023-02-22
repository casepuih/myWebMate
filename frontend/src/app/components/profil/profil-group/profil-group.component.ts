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
  listGroupMembers: any[] = []
  // Formulaire 1
  groupName!: string;
  // Formulaire 2
  selectMemberId!: number;
  selectGroupId!: number;
  selectIsAdmin!: boolean;
  selectTier!: number;
  //
  pusher!: any;
  clone!: any;


  constructor(
    private _groupsService: GroupsService,
    private _memberService: MemberService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getGroupMemberList();
    this.getMemberList();
    this.getGroupList();
  }

  // ListGroupMember
  listGM() {
    console.log(this.groupList);
  }

  //groupName
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

        for (const group of this.groupList) {

          this.listGroupMembers.push({ id: group.id, name: group.name, members: [] });

          for (const gm of this.groupsMembersList) {

            if (gm.group_id == group.id) {
              this.pusher = this.listGroupMembers.find(lgm => lgm.id == group.id);

              if (this.pusher) {
                for (const member of this.memberList) {

                  if (member.id == gm.member_id) {
                    this.clone = Object.assign({}, member);
                    this.clone['groupMember_id'] = gm.id;
                    this.clone['tier'] = gm.tier;
                    this.clone['groupAdmin'] = gm.isAdmin;
                    this.pusher['members'].push(this.clone);
                  }
                }

              } else {
                return;
              }
            }
          }
        }
        console.log(this.listGroupMembers);
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

  updateGroupMember(id: number, isAdmin: boolean, tier: number) {
    console.log(tier);
    console.log(id);
    this._groupsService.updateGroupMember(id, isAdmin, tier).subscribe({})
  }

  updateIsAdmin(isAdmin: boolean) {
    console.log(isAdmin);

  }

}
