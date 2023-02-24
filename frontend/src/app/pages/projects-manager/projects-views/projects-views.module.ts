import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsViewsPageRoutingModule } from './projects-views-routing.module';

import { ProjectsViewsPage } from './projects-views.page';
import { BoardsComponent } from 'src/app/components/boards/boards.component';
import { HomePageModule } from '../../home/home.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsViewsPageRoutingModule,
    HomePageModule
  ],
  declarations: [ProjectsViewsPage, BoardsComponent]
})
export class ProjectsViewsPageModule { }
