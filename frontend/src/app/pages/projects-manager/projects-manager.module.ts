import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsManagerPageRoutingModule } from './projects-manager-routing.module';

import { ProjectsManagerPage } from './projects-manager.page';
import { ProjectsViewsPage } from './projects-views/projects-views.page';



@NgModule({
  declarations: [ProjectsManagerPage, ProjectsViewsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsManagerPageRoutingModule
  ]
})
export class ProjectsManagerPageModule { }
