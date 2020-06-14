import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectIndexComponent } from '../select-index/select-index.component';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../dashboard.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { ScatterPlotComponent } from '../scatter-plot/scatter-plot.component';
import { HistogramComponent } from '../histogram/histogram.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { SplitByComponent } from '../split-by/split-by.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() collectionNamesLoaded = new EventEmitter<string[]>();

  constructor(private data: DataService,
    private dialog: MatDialog,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    const file = inputNode.files[0];

    this.data.loadData(file, (headers, save) => {

      const dialogRef = this.dialog.open(SelectIndexComponent, {
        width: '250px',
        data: { headers: headers }
      });

      dialogRef.afterClosed().subscribe(result => {
        save(result, (collectionName) => {
          this.dashboardService.addComponent(collectionName, DataTableComponent,
            (component => {
              component.instance.collectionName = collectionName;
            }));

          // this.collectionNamesLoaded.emit(this.data.getCollectionNames());
        });
      });
    });
  }

  openScatterPlot() {
    this.dashboardService.addComponent('Scatter plot', ScatterPlotComponent, () => { });
  }

  openHistogram() {
    this.dashboardService.addComponent('Histogram', HistogramComponent, () => { });
  }

  openStatistics() {
    this.dashboardService.addComponent('Statistics', StatisticsComponent, () => { });
  }

  openSplitBy() {
    this.dialog.open(SplitByComponent);
  }

}
