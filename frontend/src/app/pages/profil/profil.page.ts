import { Component, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  menuChosen!: string;
  groupName!: string;

  constructor(
    private _groupsService: GroupsService,
  ) { }

  ngOnInit() {
  }

  onMenuChosen(target: string) {
    this.menuChosen = target;
  }


}
