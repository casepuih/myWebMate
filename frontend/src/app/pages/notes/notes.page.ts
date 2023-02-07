import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../services/notes.service";
import {MemberService} from "../../services/member.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  note!:any;
  id!:number;

  constructor(
    private ar : ActivatedRoute,
    private _notesService : NotesService,
    private _memberService : MemberService,
    private _router : Router
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.isConnectedResolver();
    this.getNote();
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {});
  }

  getNote(){
    this._notesService.getOneNote(this.id).subscribe({
      next: (data) => {
        this.note = data.result.notes;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  changeNote() {
    this._notesService.updateNote(this.note.title, this.note.content, this.id).subscribe({});
  }

  deleteNote() {
    this._notesService.deleteNote(this.note.id).subscribe({
      next: () => {
        this._router.navigate(['home']);
      }
    });
  }
}
