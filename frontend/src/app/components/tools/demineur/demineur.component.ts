import { Component, OnInit } from '@angular/core';
import {DemineurService} from "../../../services/demineur.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-demineur',
  templateUrl: './demineur.component.html',
  styleUrls: ['./demineur.component.scss'],
})
export class DemineurComponent implements OnInit {
  board!:any;
  numberBombRemaining!:number;
  timer!:number;
  currentDifficulty!:string;
  modal:string = 'contentModalMiddleScreen easy';
  demineur:string = 'demineur easy';
  gamePad:string = 'gamePad easy';
  filesMenu:boolean = false;
  optionMenuFiles:string = 'optionMenuFiles';

  constructor(
    private _demineurService : DemineurService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.newBoard('easy');
    this.watchBoard();
    this.watchBomb();
    this.watchTimer();
    this.watchCurrentDifficulty();
  }

  watchBoard() {
    this._demineurService.boardObservable.subscribe({
      next: (data) => {
        this.board = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchBomb() {
    this._demineurService.numberBombRemaining.subscribe({
      next: (data) => {
        this.numberBombRemaining = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchTimer() {
    this._demineurService.timer.subscribe({
      next: (data) => {
        this.timer = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchCurrentDifficulty() {
    this._demineurService.currentDifficulty.subscribe({
      next: (data) => {
        this.currentDifficulty = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  newBoard(difficulty:string) {
    this._demineurService.newBoard(difficulty);
  }

  newGame() {
    this._demineurService.newBoard(this.currentDifficulty);
    this.watchBoard();
    this.watchBomb();
    this.watchTimer();
    this.watchCurrentDifficulty();
  }

  chooseGame(difficulty:string) {
    this.currentDifficulty = difficulty;
    this.modal = 'contentModalMiddleScreen ' + difficulty;
    this.demineur = 'demineur ' + difficulty;
    this.gamePad = 'gamePad ' + difficulty;
    this.toogleFilesMenu();
    this.newGame();
  }

  toogleFilesMenu() {
    this.filesMenu = !this.filesMenu;
    this.optionMenuFiles === 'optionMenuFiles' ?
      this.optionMenuFiles = 'optionMenuFiles selected' :
      this.optionMenuFiles = 'optionMenuFiles';
  }

  close() {
    this._demineurService.toogleIsOpen();
  }

  rightClick(event: MouseEvent, i: number, j: number) {
    event.preventDefault();

    this._demineurService.rightClick(i, j);
  }

  leftClick(i: number, j: number) {
    this._demineurService.leftClick(i, j);
  }
}
