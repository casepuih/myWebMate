import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/boardsModel';
import { Label } from 'src/app/models/labelsModel';
import { Project } from 'src/app/models/projectsModel';
import { ErrorService } from 'src/app/services/error.service';
import { LabelsService } from 'src/app/services/labels.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit {
  @Input() board!: Board;
  @Input() labels!: Label[];
  projectsList!: Project[];
  isCreateForm: boolean = false;
  createProjectTitle!: string;

  constructor(
    private _projectsService: ProjectsService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getProjects()
  }

  getProjects() {
    this._projectsService.getProjectsByBoard(this.board.id).subscribe({
      next: (data) => {
        this.projectsList = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  goToProject(id: number) {
    this._router.navigate(['project/' + id]);
  }

  createForm() {
    this.isCreateForm = true;
  }

  createProject() {
    this._projectsService.createProject(this.createProjectTitle, this.board.id).subscribe({
      next: (data: any) => {
        const id = data.result.id;
        this.createProjectTitle = "";
        this._router.navigate(['project/' + id]);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

}
