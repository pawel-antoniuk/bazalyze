import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { ToNumericalComponent } from '../to-numerical/to-numerical.component';

@Component({
  selector: 'app-dataset-and-variables-selector',
  templateUrl: './dataset-and-variables-selector.component.html',
  styleUrls: ['./dataset-and-variables-selector.component.scss']
})
export class DatasetAndVariablesSelectorComponent implements OnInit {
  viewNames: string[] = [];
  columnNames: string[] = [];
  columnNamesControl = new FormControl();

  @Input() selectedViewName: string | undefined;
  @Output() selectedViewNameChange = new EventEmitter<string>();
  @Input() selectedColumnNames: string[] = [];
  @Output() selectedColumnNamesChange = new EventEmitter<string[]>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
  }

  onViewNamesSelectionChange() {
    this.columnNames = this.dataService.getViewColumns(this.selectedViewName);
    this.selectedViewNameChange.emit(this.selectedViewName);
  }

  onColumnNamesSelectionChange() {
    this.selectedColumnNamesChange.emit(this.columnNamesControl.value);
  }

}
