import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import _ from 'lodash';

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
  selectedConstant: string;

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
    const viewColumnNames = this.dataService.getViewColumns(this.selectedViewName).filter(v => v != this.selectedVariableName);
    const indices = this.dataService.getViewIndices(this.selectedViewName);
    const selectedViewData = this.dataService.getView(this.selectedViewName).data;

    let newData = [];

    selectedViewData.forEach(d => {
      if (d[this.selectedVariableName] == this.selectedConstant) {
        newData.push(_.omit(d, ['$loki', 'meta', this.selectedVariableName]))
      }
    });

    this.dataService.addCollectionView(collectionName,
      `${this.selectedViewName} (${this.selectedVariableName} = ${this.selectedConstant})`,
      viewColumnNames, indices, newData)

    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }

}
