import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { ToNumericalComponent } from '../to-numerical/to-numerical.component';
import { min, max} from 'simple-statistics'

@Component({
  selector: 'app-discretize',
  templateUrl: './discretize.component.html',
  styleUrls: ['./discretize.component.scss']
})
export class DiscretizeComponent implements OnInit {

  selectedColumnNames: string[] = [];
  selectedViewName: string | undefined;
  bins: number | undefined;
  createNewColumn = false;

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<ToNumericalComponent>) { }

  ngOnInit(): void {
  }

  onAccept() {
    const selectedColumnNames: string[] = this.selectedColumnNames;

    selectedColumnNames.forEach(columnName => {
      const columnValues = this.dataService.getView(this.selectedViewName).chain()
        .where(o => o[columnName] != null)
        .mapReduce(o => o[columnName], a => a);
      const minValue = min(columnValues);
      const maxValue = max(columnValues);

      if(this.createNewColumn) {
        const newColumnName = `discret(${columnName})`;
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[newColumnName] = this.discretize(row[columnName], minValue, maxValue);
        });

        this.dataService.getViewColumns(this.selectedViewName).push(newColumnName);
        this.dataService.collectionUpdated(this.selectedViewName);
      } else {
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[columnName] = this.discretize(row[columnName], minValue, maxValue);
        });
      }
    });

    const collectionName = this.dataService.getViewNameCollection(this.selectedViewName);
    this.dataService.collectionUpdated(collectionName);
    this.dialogRef.close();
  }

  private discretize(currentValue: number, minValue: number, maxValue: number) {
    return Math.floor((currentValue - minValue) / (maxValue - minValue) * this.bins);
  }

}
