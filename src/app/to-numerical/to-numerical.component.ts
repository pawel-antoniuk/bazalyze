import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-to-numerical',
  templateUrl: './to-numerical.component.html',
  styleUrls: ['./to-numerical.component.scss']
})
export class ToNumericalComponent implements OnInit {

  selectedColumnNames: string[] = [];
  selectedViewName: string | undefined;
  createNewColumn = false;

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<ToNumericalComponent>) { }

  ngOnInit(): void {

  }

  onAccept() {
    const selectedColumnNames: string[] = this.selectedColumnNames;

    selectedColumnNames.forEach(columnName => {
      const categoricalValues = this.getCategoricalMap(columnName);

      if(this.createNewColumn) {
        const newColumnName = `cat(${columnName})`;
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[newColumnName] = categoricalValues[row[columnName]];
        });

        this.dataService.getViewColumns(this.selectedViewName).push(newColumnName);
        this.dataService.collectionUpdated(this.selectedViewName);
      } else {
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[columnName] = categoricalValues[row[columnName]];
        });
      }
    });

    const collectionName = this.dataService.getViewNameCollection(this.selectedViewName);
    this.dataService.collectionUpdated(collectionName);
    this.dialogRef.close();
  }

  private getCategoricalMap(columnName: string) {
    let categoricalValues = {};
    let categoricalIndex = 0;

    this.dataService.getView(this.selectedViewName).data.forEach(row => {
      if(!(row[columnName] in categoricalValues)) {
        categoricalValues[row[columnName]] = categoricalIndex;
        categoricalIndex += 1;
      }
    })

    return categoricalValues;
  }

}
