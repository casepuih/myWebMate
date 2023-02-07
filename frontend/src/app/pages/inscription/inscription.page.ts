import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  isRegister!:boolean;
  email!:string;
  password!:string;
  firstname!:string;
  lastname!:string;

  constructor(
    private _memberService : MemberService,
    private _errorService : ErrorService
  ) {}

  ngOnInit() {
    this.isRegister = false;
  }

  makeInscription() {
      this._memberService.inscription(this.email, this.password, this.firstname, this.lastname).subscribe(
        result => {
          this.isRegister = true;
        },
        error => {
          this._errorService.errorHandler(error);
        })
  }

  checkIfEmpty() {
    return !this.email || !this.password || !this.firstname || !this.lastname;
  }
}
