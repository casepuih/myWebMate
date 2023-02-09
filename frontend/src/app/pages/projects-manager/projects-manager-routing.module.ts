import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsManagerPage } from './projects-manager.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsManagerPage
  },
  {
    path: 'project-details',
    loadChildren: () => import('./project-details/project-details.module').then( m => m.ProjectDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsManagerPageRoutingModule {}
