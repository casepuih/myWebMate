import { Component, OnInit } from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
  calculator!:boolean;

  constructor(
    private _calculatorService : CalculatorService
  ) { }

  ngOnInit() {
    this.getDisplay();
  }

  getDisplay() {
    this._calculatorService.isOpenObservable.subscribe({
      next:(data) => {
        this.calculator = data;
      }
    })
  }

  calculatorToogle() {
    this._calculatorService.toogleIsOpen();
  }
}
