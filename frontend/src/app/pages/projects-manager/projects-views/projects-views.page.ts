import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/boardsModel';
import { Label } from 'src/app/models/labelsModel';
import { BoardsService } from 'src/app/services/boards.service';
import { ErrorService } from 'src/app/services/error.service';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-projects-views',
  templateUrl: './projects-views.page.html',
  styleUrls: ['./projects-views.page.scss'],
})
export class ProjectsViewsPage implements OnInit {
  boardsList!: Array<Board>;
  isCreateForm!: boolean;
  newBoard!: string;
  labelsList!: Label[]

  constructor(
    private ar: ActivatedRoute,
    private _labelsService: LabelsService,
    private _boardsService: BoardsService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.isConnectedResolver();
    this.getBoardsList();
    this.getLabelsList();
    this.getEmitter();
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({ isConnectedResolver }) => { });
  }

  getEmitter() {
    this._boardsService.getBoardUpdateEmitter().subscribe({
      next: () => {
        this.getBoardsList()
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getLabelsList() {
    this._labelsService.getLabelsList().subscribe({
      next: (data) => {
        this.labelsList = data.result.labels;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getBoardsList() {
    this._boardsService.getBoardsList().subscribe({
      next: (data) => {
        this.boardsList = data.result.boards;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  createForm() {
    this.isCreateForm = true;
  }

  createBoard() {
    this._boardsService.createBoard(this.newBoard).subscribe({
      next: (data: any) => {
        this.newBoard = "";
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

}
