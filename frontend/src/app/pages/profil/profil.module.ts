import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilPageRoutingModule } from './profil-routing.module';

import { ProfilPage } from './profil.page';
import { HomePageModule } from "../home/home.module";
import { ProfilComponent } from "../../shared/menu/profil/profil.component";
import { ProfilInformationComponent } from "../../components/profil/profil-information/profil-information.component";
import { ProfilRelationComponent } from "../../components/profil/profil-relation/profil-relation.component";
import { ProfilGroupComponent } from 'src/app/components/profil/profil-group/profil-group.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilPageRoutingModule,
    HomePageModule
  ],
  declarations: [ProfilPage, ProfilComponent, ProfilInformationComponent, ProfilRelationComponent, ProfilGroupComponent]
})
export class ProfilPageModule { }
