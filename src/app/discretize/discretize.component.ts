import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { ToNumericalComponent } from '../to-numerical/to-numerical.component';
import { min, max } from 'simple-statistics'

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
  convertToText = false;

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

      let targetColumnName;
      if (this.createNewColumn) {
        if (this.convertToText) {
          targetColumnName = `discret(${columnName}, ${this.bins}, text)`;
        } else {
          targetColumnName = `discret(${columnName}, ${this.bins})`;
        }
      } else {
        targetColumnName = columnName;
      }

      if (this.convertToText) {
        let textValues = {};
        for (let i = 0; i <= (maxValue - minValue) / this.bins + 1; ++i) {
          const lowerLimit = i * (maxValue - minValue) / this.bins + minValue;
          const upperLimit = (i + 1) * (maxValue - minValue) / this.bins + minValue;
          textValues[i] = `[${lowerLimit.toFixed(2)}, ${upperLimit.toFixed(2)})`;
        }

        const lastIndex = Math.floor((maxValue - minValue) / this.bins) + 2;
        const lowerLimit = lastIndex * (maxValue - minValue) / this.bins + minValue;
        const upperLimit = (lastIndex + 1) * (maxValue - minValue) / this.bins + minValue;
        textValues[lastIndex] = `[${lowerLimit.toFixed(2)}, ${upperLimit.toFixed(2)}]`;
        textValues[lastIndex + 1] = `[${lowerLimit.toFixed(2)}, ${upperLimit.toFixed(2)}]`;

        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[targetColumnName] = textValues[this.discretize(row[columnName], minValue, maxValue)];
        });
      } else {
        this.dataService.getView(this.selectedViewName).data.forEach(row => {
          row[targetColumnName] = this.discretize(row[columnName], minValue, maxValue);
        });
      }

      if (this.createNewColumn) {
        this.dataService.getViewColumns(this.selectedViewName).push(targetColumnName);
        this.dataService.collectionUpdated(this.selectedViewName);
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
