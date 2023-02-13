import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsViewsPage } from './projects-views.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsViewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsViewsPageRoutingModule {}
