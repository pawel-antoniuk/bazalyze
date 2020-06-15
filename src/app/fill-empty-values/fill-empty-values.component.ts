import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SplitByComponent } from '../split-by/split-by.component';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { mean, median, mode, min, max } from 'simple-statistics'

const FillMethodFunctions = { 'mean': mean, 'median': median, 'mode': mode, 'min': min, 'max': max };

@Component({
  selector: 'app-fill-empty-values',
  templateUrl: './fill-empty-values.component.html',
  styleUrls: ['./fill-empty-values.component.scss']
})
export class FillEmptyValuesComponent implements OnInit {

  selectedViewName: string;
  viewNames: string[] = [];
  columnNames: string[] = [];
  methodNames = ['mean', 'median', 'mode', 'min', 'max', 'constant'];
  selectedMethodName: string;
  selectedConstant: string;

  columnNamesControl = new FormControl();

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onDatasetSelectionChange() {
    this.columnNames = this.dataService.getViewColumns(this.selectedViewName);
  }

  onAccept() {
    const selectedColumnNames: string[] = this.columnNamesControl.value;

    const fillMethodFunctions = {...FillMethodFunctions, 'constant': (values: number[]) => +this.selectedConstant};
    selectedColumnNames.forEach(columnName => this.fillValues(columnName, fillMethodFunctions[this.selectedMethodName]));
    this.dataService.collectionUpdated(this.dataService.getViewNameCollection(this.selectedViewName));

    this.dialogRef.close();
  }

  fillValues(variableName: string, fillMethod: (numbers: number[]) => number) {
    const allValues = this.dataService.getView(this.selectedViewName).chain()
      .where(o => o[variableName] != null)
      .mapReduce(o => o[variableName], a => a);
    const fillValue = fillMethod(allValues);

    this.dataService.getView(this.selectedViewName).data.forEach(o => {
      if (o[variableName] == null) {
        o[variableName] = +fillValue.toFixed(4);
      }
    });
  }

}
