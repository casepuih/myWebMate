import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private _labelsService: LabelsService,
    private _errorService: ErrorService,
  ) { }

  ngOnInit() {
  }

  deleteLabel() {
    this._labelsService.deleteLabel(this.label.id).subscribe({
      next: (data: any) => {
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
