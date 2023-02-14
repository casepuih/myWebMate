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

  constructor(
    private _projectsService: ProjectsService,
    private _labelsService: LabelsService,
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

}
