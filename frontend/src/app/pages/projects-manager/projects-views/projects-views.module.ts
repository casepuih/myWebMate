import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsViewsPageRoutingModule } from './projects-views-routing.module';

import { ProjectsViewsPage } from './projects-views.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsViewsPageRoutingModule
  ],
  // declarations: [ProjectsViewsPage]
})
export class ProjectsViewsPageModule { }
