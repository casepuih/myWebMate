import { Component, OnInit } from '@angular/core';
import { MemberService } from "../../../services/member.service";
import { NotesService } from "../../../services/notes.service";
import { Note } from "../../../models/notesModel";
import { Router } from "@angular/router";
import { ErrorService } from "../../../services/error.service";

@Component({
  selector: 'app-notes-menu',
  templateUrl: './notes-menu.component.html',
  styleUrls: ['./notes-menu.component.scss'],
})
export class NotesMenuComponent implements OnInit {
  notesList!: Array<Note>;
  token!: string;
  isCreateForm: boolean = false;
  addNoteClass: string = "noteCard";
  createNoteTitle!: string;

  constructor(
    private _notesService: NotesService,
    private _memberService: MemberService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getList();
    this.getEmitter();
  }

  getList() {
    this._notesService.getNotesList().subscribe({
      next: (data) => {
        this.notesList = data.result.notes;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getEmitter() {
    this._notesService.getNoteUpdateEmitter().subscribe({
      next: () => {
        this.getList()
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  goToNote(id: number) {
    this._router.navigate(['notes/' + id]);
  }

  createForm() {
    this.isCreateForm = true;
    this.addNoteClass = "addNoteCard";
  }

  addNote() {
    this._notesService.createNote(this.createNoteTitle).subscribe({
      next: (data: any) => {
        const id = data.result.id;
        this.isCreateForm = false;
        this.createNoteTitle = "";
        this.addNoteClass = "noteCard";
        this._router.navigate(['notes/' + id]);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }
}
