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
    const leftColumnNames = this.dataService.getViewColumns(this.leftSelectedViewName);
    const rightColumnNames = _.clone(this.dataService.getViewColumns(this.rightSelectedViewName));
    let rightRenamedColumnNames: { [id: string]: string } = {};

    rightColumnNames.forEach((n, index) => {
      if (leftColumnNames.includes(n)) {
        rightColumnNames[index] += '*';
        rightRenamedColumnNames[n] = rightColumnNames[index];
      } else {
        rightRenamedColumnNames[n] = n;
      }
    })

    // this is a very BAD code. need a lot of optimization.
    const rightDataset = this.dataService.getView(this.rightSelectedViewName);
    const newDataset = this.dataService.getView(this.leftSelectedViewName).eqJoin(
      rightDataset, this.leftSelectedVariableName, this.rightSelectedVariableName,
      (left, right) => {
        const copyRight = {};
        Object.entries(rightRenamedColumnNames).forEach(([prevName, newName]) => {
          copyRight[newName] = right[prevName];
        });

        delete copyRight[rightRenamedColumnNames[this.rightSelectedVariableName]];

        return { ...copyRight, ...left };
      }, {
      removeMeta: true
    }).data();

    ['$loki', 'meta'].forEach(p => newDataset.forEach(o => delete o[p]));

    const newColumnNames = leftColumnNames
      .concat(rightColumnNames)
      .filter(c => c != rightRenamedColumnNames[this.rightSelectedVariableName]);

    const leftIndices = this.dataService.getViewIndices(this.leftSelectedViewName);
    const rightIndices = _.clone(this.dataService.getViewIndices(this.rightSelectedViewName));

    rightIndices.forEach((ri, i) => {
      if (ri in rightRenamedColumnNames) {
        rightIndices[i] = rightRenamedColumnNames[ri];
      }
    })

    const newIndices = leftIndices.concat(rightIndices);

    console.log(rightRenamedColumnNames);
    console.log(newColumnNames);
    console.log(newIndices);
    console.log(newDataset);

    this.dataService.addCollection(this.newDatasetName, newIndices, newColumnNames, newDataset);
    this.dashboardService.addComponent(this.newDatasetName, DataTableComponent, ref => {
      ref.instance.collectionName = this.newDatasetName;
    });

    this.dialogRef.close();
  }

}
