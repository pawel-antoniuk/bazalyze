import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { DataService } from '../data.service';
import { SelectIndexComponent } from '../select-index/select-index.component';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-sample-data',
  templateUrl: './sample-data.component.html',
  styleUrls: ['./sample-data.component.scss']
})
export class SampleDataComponent implements OnInit {

  availableDatasets: string[] = ['medical_data.csv', 'mortality_data.csv'];
  otherResources: string[] = ['medical_data_names.json', 'mortality_data_names.json', 'readme.txt']
  selectedDataset: string;

  constructor(private dataService: DataService,
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
  }

  onLoad() {
    this.dataService.loadDataFromAssets(this.selectedDataset, (headers, save) => {

      const dialogRef = this.dialog.open(SelectIndexComponent, {
        data: { headers: headers }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === null || Array.isArray(result)) {
          save(result, (collectionName) => {
            this.dashboardService.addComponent(collectionName, DataTableComponent,
              (component => {
                component.instance.collectionName = collectionName;
              }));
          });
        }
      });
    });

    this.dialogRef.close();
  }

}
