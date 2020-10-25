import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import _ from 'lodash';
import { min, max, variance, sampleStandardDeviation, mean, mode, quantile, sampleSkewness } from 'simple-statistics'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  viewNames: string[] = [];
  variableNames: string[] = [];
  selectedViewName: string;
  selectedVariableName: string;
  operators = ['=', '>', '<', '>=', '<=', '!=', 'top', 'bottom'];
  selectedOperator: string = '=';
  selectedConstant: number | undefined;
  keepVariable = false;

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
    this.selectedViewName = '';
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getViewColumns(this.selectedViewName);
  }

  onVariableSelectionChange() {

  }

  onAccept() {
    const collectionName = this.dataService.getViewNameCollection(this.selectedViewName);

    let viewColumnNames;
    if(this.keepVariable) {
      viewColumnNames = this.dataService.getViewColumns(this.selectedViewName);
    } else {
      viewColumnNames = this.dataService.getViewColumns(this.selectedViewName)
        .filter(v => v != this.selectedVariableName);
    }

    const indices = this.dataService.getViewIndices(this.selectedViewName);
    const selectedViewData = this.dataService.getView(this.selectedViewName).data;

    const columnValues = this.dataService.getView(collectionName).chain()
      .where(o => o[this.selectedVariableName] != null)
      .mapReduce(o => o[this.selectedVariableName], a => a);
    const minValue = min(columnValues);
    const maxValue = max(columnValues);

    let operatorSelector: {[id: string]: (a: any, b: any) => boolean} = {
      '=': (a, b) => a == b,
      '>': (a, b) => a > b,
      '<': (a, b) => a < b,
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
      '!=': (a, b) => a != b,
      'top': (a, b) => (maxValue - minValue) * (100 - b) / 100 + minValue <= a,
      'bottom': (a, b) => (maxValue - minValue) * b / 100 + minValue >= a,
    };

    const suffix = this.selectedOperator == 'top' || this.selectedOperator == 'bottom' ? '%' : '';

    const filteredData = this.filter(selectedViewData, operatorSelector[this.selectedOperator]);

    this.dataService.addCollectionView(collectionName,
      `${this.selectedViewName} (${this.selectedVariableName} ${this.selectedOperator} ${this.selectedConstant}${suffix})`,
      viewColumnNames, indices, filteredData)

    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }

  private filter(selectedViewData: any[], comparisonOperator: (a: any, b: any) => boolean) {
    let filteredData = [];
    selectedViewData.forEach(row => {
      if (comparisonOperator(row[this.selectedVariableName], this.selectedConstant)) {
        filteredData.push(_.omit(row, ['$loki', 'meta']))
      }
    });

    return filteredData;
  }

}
