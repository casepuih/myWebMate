import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { HomePageModule } from "../../home/home.module";
import { ProjectLabelsComponent } from "../../../components/project-manager/project-labels/project-labels.component";

@NgModule({
  declarations: [ProjectDetailsPage, ProjectLabelsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    HomePageModule,
  ]
})
export class ProjectDetailsPageModule { }
