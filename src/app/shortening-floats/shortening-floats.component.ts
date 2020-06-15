import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { DashboardService } from '../dashboard.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormControl } from '@angular/forms';
import _ from "lodash";

@Component({
  selector: 'app-shortening-floats',
  templateUrl: './shortening-floats.component.html',
  styleUrls: ['./shortening-floats.component.scss']
})
export class ShorteningFloatsComponent implements OnInit {

  selectedViewName: string;
  viewNames: string[] = [];
  columnNames: string[] = [];
  selectedDecimalPlaces: number = 2;

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
    const factor = Math.pow(10, this.selectedDecimalPlaces);

    selectedColumnNames.forEach(columnName => {
      this.dataService.getView(this.selectedViewName).data.forEach(v => {
        v[columnName] =  Math.round(v[columnName] * factor) / factor;
      })
    });

    this.dataService.collectionUpdated(this.dataService.getViewNameCollection(this.selectedViewName));
    this.dialogRef.close();
  }

}
