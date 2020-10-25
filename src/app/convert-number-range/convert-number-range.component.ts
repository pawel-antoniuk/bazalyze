import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { min, max } from 'simple-statistics';
import { DataService } from '../data.service';
import { ToNumericalComponent } from '../to-numerical/to-numerical.component';

@Component({
  selector: 'app-convert-number-range',
  templateUrl: './convert-number-range.component.html',
  styleUrls: ['./convert-number-range.component.scss']
})
export class ConvertNumberRangeComponent implements OnInit {

  selectedColumnNames: string[] = [];
  selectedViewName: string | undefined;
  lowerLimit: number | undefined = 0;
  upperLimit: number | undefined = 1;
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
        const newColumnName = `scale(${columnName}, ${this.lowerLimit}, ${this.upperLimit})`;
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[newColumnName] = this.convertRange(row[columnName], minValue, maxValue);
        });

        this.dataService.getViewColumns(this.selectedViewName).push(newColumnName);
        this.dataService.collectionUpdated(this.selectedViewName);
      } else {
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[columnName] = this.convertRange(row[columnName], minValue, maxValue);
        });
      }
    });

    const collectionName = this.dataService.getViewNameCollection(this.selectedViewName);
    this.dataService.collectionUpdated(collectionName);
    this.dialogRef.close();
  }

  private convertRange(currentValue: number, minValue: number, maxValue: number) {
    return (currentValue - minValue) / (maxValue - minValue) * (this.upperLimit - this.lowerLimit) + this.lowerLimit;
  }

}
