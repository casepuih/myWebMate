import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/projectsModel';
import { ErrorService } from 'src/app/services/error.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  project!: Project;
  id!: number;

  constructor(
    private ar: ActivatedRoute,
    private _projectsService: ProjectsService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.isConnectedResolver();
    this.getProject();
    console.log(this.project);

  }

  isConnectedResolver() {
    this.ar.data.subscribe(({ isConnectedResolver }) => { });
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
}
