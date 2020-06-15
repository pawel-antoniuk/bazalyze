import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';

@Component({
  selector: 'app-rename-columns',
  templateUrl: './rename-columns.component.html',
  styleUrls: ['./rename-columns.component.scss']
})
export class RenameColumnsComponent implements OnInit {

  viewNames: string[] = [];
  viewName: string;
  columnNames: string[];
  originalColumnNames: string[];

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onRename() {
    this.originalColumnNames.forEach((originalName, i) => {
      if (this.columnNames[i]) {
        this.dataService.getView(this.viewName).data.forEach(o => {
          o[this.columnNames[i]] = o[originalName];
        });
      }
    });

    this.originalColumnNames.forEach((originalName, i) => {
      if (originalName != this.columnNames[i] || !this.columnNames[i]) {
        this.dataService.getView(this.viewName).data.forEach(o => {
          delete o[originalName];
        });
      }
    });

    const collectionName = this.dataService.getViewNameCollection(this.viewName);
    this.originalColumnNames.splice(0, this.originalColumnNames.length, ...this.columnNames.filter(n => n));
    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }

  onChangeDataset() {
    this.columnNames = Object.assign([], this.dataService.getViewColumns(this.viewName));
    this.originalColumnNames = this.dataService.getViewColumns(this.viewName);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#renameFile');
    const file: File = inputNode.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const names: { [id: string]: string } = JSON.parse(fileReader.result.toString());

      this.originalColumnNames.forEach((originalName, index) => {
        if (originalName in names) {
          this.columnNames[index] = names[originalName];
        }
      });
    }
    fileReader.readAsText(file);
  }
}
