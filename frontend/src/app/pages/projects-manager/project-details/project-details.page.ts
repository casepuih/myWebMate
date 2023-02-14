import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/boardsModel';
import { Label } from 'src/app/models/labelsModel';
import { Project } from 'src/app/models/projectsModel';
import { BoardsService } from 'src/app/services/boards.service';
import { ErrorService } from 'src/app/services/error.service';
import { LabelsService } from 'src/app/services/labels.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  project!: Project;
  id!: number;
  boardsList!: Array<Board>;
  labels?: Label[];
  newLabel = {
    color: "",
    title: "",
  }

  constructor(
    private ar: ActivatedRoute,
    private _projectsService: ProjectsService,
    private _labelsService: LabelsService,
    private _boardsService: BoardsService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.isConnectedResolver();
    this.getProject();
    this.getLabelsFromProject();
    this.getEmitter();
    this.getBoards();
    console.log(this.project);

  }

  isConnectedResolver() {
    this.ar.data.subscribe(({ isConnectedResolver }) => { });
  }

  getEmitter() {
    this._labelsService.getLabelUpdateEmitter().subscribe({
      next: () => {
        this.getLabelsFromProject()
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getProject() {
    this._projectsService.getOneProject(this.id).subscribe({
      next: (data) => {
        this.project = data.result.projects;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  changeProject() {
    this._projectsService.updateProject(this.project.title, this.project.description, this.project.dateBegin, this.project.dateEnding, this.id).subscribe({});
  }

  deleteProject() {
    this._projectsService.deleteProject(this.project.id).subscribe({
      next: () => {
        this._router.navigate(['home']);
      }
    });
  }

  createLabel() {
    this._labelsService.createLabel(this.newLabel.title, this.newLabel.color, this.id).subscribe({
      next: (data: any) => {
        const id = data.result.id;
        this.newLabel.title = "";
        this.newLabel.color = "";
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });

  }

  getLabelsFromProject() {
    this._labelsService.getLabelsFromProject(this.id).subscribe({
      next: (data) => {
        this.labels = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getBoards() {
    this._boardsService.getBoardsList().subscribe({
      next: (data) => {
        this.boardsList = data.result.boards;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }
}
