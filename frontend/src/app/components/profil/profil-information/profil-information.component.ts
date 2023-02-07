import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../../services/member.service";
import {ErrorService} from "../../../services/error.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-profil-information',
  templateUrl: './profil-information.component.html',
  styleUrls: ['./profil-information.component.scss'],
})
export class ProfilInformationComponent implements OnInit {
  lastname!:string;
  firstname!:string;

  constructor(
    private _memberService : MemberService,
    private _errorService : ErrorService,
    private _alertService : AlertService
  ) { }

  ngOnInit() {
    this.getMyProfil();
  }


  getMyProfil() {
    this._memberService.getMyProfil().subscribe({
      next: (data) => {
        this.lastname = data.result.lastname;
        this.firstname = data.result.firstname;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

  updateMyName() {
    this._memberService.updateMyName(this.lastname, this.firstname).subscribe({
      next: () => {
        this._alertService.alerte("Profil mis à jour", "Vos informations ont bien été mis à jour");
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }
}
