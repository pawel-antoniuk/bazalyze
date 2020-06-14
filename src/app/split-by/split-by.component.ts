import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import _ from "lodash";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-split-by',
  templateUrl: './split-by.component.html',
  styleUrls: ['./split-by.component.scss']
})
export class SplitByComponent implements OnInit {

  viewNames: string[] = [];
  variableNames: string[] = [];

  viewName: string;
  variableName: string;

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getViewColumns(this.viewName);
    this.variableName = '';
  }

  onAccept() {
    const collectionName = this.dataService.getViewNameCollection(this.viewName);
    const columnNames = this.dataService.getViewColumns(this.viewName);
    const indices = this.dataService.getViewIndices(this.viewName);

    let groups: { [id: string]: any[] } = {}
    this.dataService.getView(this.viewName).find()
      .forEach(o => {
        const value = o[this.variableName];
        if (!(value in groups)) {
          groups[value] = [];
        }

        groups[value].push(_.pick(o, columnNames));
      });

    for (let [value, group] of Object.entries(groups)) {
      this.dataService.addCollectionView(collectionName,
        `${this.viewName} (${this.variableName} = ${value})`,
        columnNames, indices, group)
    }

    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }

}
