import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { AlertComponent } from '../alert/alert.component';
import _ from "lodash";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  viewNames: string[] = [];
  viewName: string;
  expression: string = '';

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onAdd() {
    if (!this.viewName
      || !this.expression) {
      return;
    }

    let updateFunction: (x: any) => void;
    try {
      updateFunction = eval(`(x) => { ${this.expression} }`);
    } catch (e) {
      this.showError('Error', e.message);
      return;
    }

    this.dataService.getView(this.viewName).data.forEach(o => updateFunction(o));

    // update column names
    let columnNames = this.dataService.getViewColumns(this.viewName);
    let trialDocument = this.dataService.getView(this.viewName).findOne();
    trialDocument = _.cloneDeep(_.pick(trialDocument, columnNames));
    updateFunction(trialDocument);
    const newColumnNames = Object.keys(trialDocument);
    columnNames.splice(0, columnNames.length, ...newColumnNames);

    const collectionName = this.dataService.getViewNameCollection(this.viewName);
    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }

  showError(title: string, message: string) {
    this.dialog.open(AlertComponent, {
      data: {
        title: title,
        message: message
      }
    });
  }
}
