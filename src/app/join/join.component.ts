import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { DashboardService } from '../dashboard.service';
import { DataTableComponent } from '../data-table/data-table.component';
import _ from "lodash";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  viewNames: string[] = [];

  leftVariableNames: string[] = [];
  leftSelectedViewName: string;
  leftSelectedVariableName: string;

  rightVariableNames: string[] = [];
  rightSelectedViewName: string;
  rightSelectedVariableName: string;

  newDatasetName: string;

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>,
    private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onLeftDatasetSelectionChange() {
    this.leftVariableNames = this.dataService.getViewColumns(this.leftSelectedViewName);
    this.leftSelectedVariableName = '';
  }

  onRightDatasetSelectionChange() {
    this.rightVariableNames = this.dataService.getViewColumns(this.rightSelectedViewName);
    this.rightSelectedVariableName = '';
  }

  generateNewDatasetName() {
    this.newDatasetName = `${this.leftSelectedViewName} \
+ ${this.rightSelectedViewName} (${this.leftSelectedVariableName}, ${this.rightSelectedVariableName})`;
  }

  onJoin() {
    const newDataset = this.dataService.getView(this.leftSelectedViewName).eqJoin(
      this.dataService.getView(this.rightSelectedViewName),
      this.leftSelectedVariableName, this.rightSelectedVariableName,
      (left, right) => ({ ...left, ...right }), {
      removeMeta: true
    })
      .data();

    ['$loki', 'meta', this.rightSelectedVariableName].forEach(p => newDataset.forEach(o => delete o[p]));

    const leftColumnNames = this.dataService.getViewColumns(this.leftSelectedViewName);
    const rightColumnNames = this.dataService.getViewColumns(this.rightSelectedViewName);
    const newColumnNames = leftColumnNames
      .concat(rightColumnNames)
      .filter(c => c != this.rightSelectedVariableName);

    const leftIndices = this.dataService.getViewIndices(this.leftSelectedViewName);
    const rightIndices = this.dataService.getViewIndices(this.rightSelectedViewName);
    const newIndices = leftIndices.concat(rightIndices);

    this.dataService.addCollection(this.newDatasetName, newIndices, newColumnNames, newDataset);
    this.dashboardService.addComponent(this.newDatasetName, DataTableComponent, ref => {
      ref.instance.collectionName = this.newDatasetName;
    });

    this.dialogRef.close();
  }

}
