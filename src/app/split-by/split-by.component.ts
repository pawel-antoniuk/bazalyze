import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import _ from "lodash";
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-split-by',
  templateUrl: './split-by.component.html',
  styleUrls: ['./split-by.component.scss']
})
export class SplitByComponent implements OnInit {

  viewNames: string[] = [];
  variableNames: string[] = [];

  variableNameControl = new FormControl();
  viewNameControl = new FormControl();

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onDatasetSelectionChange() {
    this.variableNames = [];
    (this.viewNameControl.value as string[]).forEach(viewName => {
      this.variableNames.push(...this.dataService.getViewColumns(viewName));
    });
    this.variableNames = _.uniq(this.variableNames);
  }

  onAccept() {
    (this.viewNameControl.value as string[]).forEach(viewName => {

      const collectionName = this.dataService.getViewNameCollection(viewName);
      const columnNames = this.dataService.getViewColumns(viewName);
      const indices = this.dataService.getViewIndices(viewName);

      (this.variableNameControl.value as string[]).forEach(variableName => {
        if (columnNames.includes(variableName)) {
          let groups: { [id: string]: any[] } = {}
          this.dataService.getView(viewName).find()
            .forEach(o => {
              const value = o[variableName];
              if (!(value in groups)) {
                groups[value] = [];
              }

              groups[value].push(_.pick(o, columnNames.filter(c => c != variableName)));
            });

          const viewColumnNames = columnNames.filter(c => c != variableName);

          for (let [value, group] of Object.entries(groups)) {
            this.dataService.addCollectionView(collectionName,
              `${viewName} (${variableName} = ${value})`,
              viewColumnNames, indices, group)
          }
        }
      });

      this.dataService.collectionUpdated(collectionName);
    });

    this.dialogRef.close();
  }

}
