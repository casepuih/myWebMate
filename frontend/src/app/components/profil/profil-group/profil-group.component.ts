import { Component, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-profil-group',
  templateUrl: './profil-group.component.html',
  styleUrls: ['./profil-group.component.scss'],
})
export class ProfilGroupComponent implements OnInit {

  groupName!: string;

  constructor(
    private _groupsService: GroupsService,
  ) { }

  ngOnInit() { }

  gName() {
    this._groupsService.createGroup(this.groupName).subscribe({})
    this.groupName = ""
  }

}
