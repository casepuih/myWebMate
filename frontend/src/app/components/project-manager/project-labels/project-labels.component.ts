import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Label } from 'src/app/models/labelsModel';
import { ErrorService } from 'src/app/services/error.service';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-project-labels',
  templateUrl: './project-labels.component.html',
  styleUrls: ['./project-labels.component.scss'],
})
export class ProjectLabelsComponent implements OnInit {
  @Input() label!: Label

  constructor() { }

  ngOnInit() {
  }

}
