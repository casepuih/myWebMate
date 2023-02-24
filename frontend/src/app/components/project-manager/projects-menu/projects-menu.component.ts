import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/projectsModel';
import { ErrorService } from 'src/app/services/error.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects-menu',
  templateUrl: './projects-menu.component.html',
  styleUrls: ['./projects-menu.component.scss'],
})
export class ProjectsMenuComponent implements OnInit {
  projectsList!: Array<Project>;
  addProjectClass: string = "projectCard";
  isCreateForm: boolean = false;
  createProjectTitle!: string;

  constructor(
    private _projectsService: ProjectsService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.getList();
    this.getEmitter();
  }

  allProjects() {
    this._router.navigate(['/projects-boards']);
  }

  getList() {
    this._projectsService.getProjectsList().subscribe({
      next: (data) => {
        this.projectsList = data.result.projects;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getEmitter() {
    this._projectsService.getProjectUpdateEmitter().subscribe({
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

  goToProject(id: number) {
    this._router.navigate(['project/' + id]);
  }

  addProject() {
    this._projectsService.createProject(this.createProjectTitle).subscribe({
      next: (data: any) => {
        const id = data.result.id;
        this.isCreateForm = false;
        this.createProjectTitle = "";
        this.addProjectClass = "projectCard";
        this._router.navigate(['project/' + id]);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
