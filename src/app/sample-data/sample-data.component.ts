import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { DataService } from '../data.service';
import { SelectIndexComponent } from '../select-index/select-index.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { DataLoaderService } from '../data-loader.service';

@Component({
  selector: 'app-sample-data',
  templateUrl: './sample-data.component.html',
  styleUrls: ['./sample-data.component.scss']
})
export class SampleDataComponent implements OnInit {

  availableDatasets: string[] = ['medical_data.csv', 'mortality_data.csv'];
  otherResources: string[] = ['medical_data_names.json', 'mortality_data_names.json', 'readme.txt']
  selectedDataset: string;

  constructor(private dataLoader: DataLoaderService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
  }

  onLoad() {
    const url = `${window.location.href}assets/${this.selectedDataset}`;
    console.log(url);
    const name = this.selectedDataset.split('.')[0];
    this.dataLoader.loadAsset(url, name);
    this.dialogRef.close();
  }

}
