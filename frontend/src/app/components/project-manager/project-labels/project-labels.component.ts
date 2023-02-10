import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Label } from 'src/app/models/labelsModel';
import { ErrorService } from 'src/app/services/error.service';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-project-labels',
  templateUrl: './project-labels.component.html',
  styleUrls: ['./project-labels.component.scss'],
})
export class ProjectLabelsComponent implements OnInit {

  labelsList!: Array<Label>;
  addProjectClass: string = "projectCard";
  isCreateForm: boolean = false;
  createLabelTitle!: string;
  createLabelColor!: string;

  constructor(
    private _labelsService: LabelsService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getList();
    this.getEmitter();
  }

  getList() {
    this._labelsService.getLabelsList().subscribe({
      next: (data) => {
        this.labelsList = data.result.labels;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getEmitter() {
    this._labelsService.getLabelUpdateEmitter().subscribe({
      next: () => {
        this.getList()
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  createForm() {
    this.isCreateForm = true;
    this.addProjectClass = "addProjectCard";
  }

  addLabel() {
    this._labelsService.createLabel(this.createLabelTitle, this.createLabelColor).subscribe({
      next: (data: any) => {
        const id = data.result.id;
        this.isCreateForm = false;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
