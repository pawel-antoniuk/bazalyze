import { Component, OnInit, ViewChild } from '@angular/core';
import { PlotComponent } from 'angular-plotly.js';
import { DataService } from '../data.service';
import { DashboardService } from '../dashboard.service';
import { sampleCorrelation } from 'simple-statistics'

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrls: ['./correlation-matrix.component.scss']
})
export class CorrelationMatrixComponent implements OnInit {

  @ViewChild(PlotComponent, { static: true })
  plotly: PlotComponent;

  variableNames: string[] = [];
  collectionNames: string[] = [];
  collectionName: string = '';

  public graph = {
    layout: {
      width: 800, height: 600,
      margin: { l: 60, r: 10, t: 10, b: 60 }
    },
    data: [{
      type: 'heatmap',
      hoverongaps: false,
      x: [], y: [], z: []
    }]
  };

  constructor(private dataService: DataService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getViewNames();
  }

  reloadData() {
    if (!this.collectionName) {
      return;
    }


    this.variableNames.forEach(yName => {
      let row: number[] = [];

      this.variableNames.forEach(xName => {
        const xValues = this.dataService.getView(this.collectionName).data.map(o => o[xName]);
        const yValues = this.dataService.getView(this.collectionName).data.map(o => o[yName]);

        row.push(sampleCorrelation(xValues, yValues));
      })

      this.graph.data[0].z.push(row);
    })

    this.graph.data[0].x = this.variableNames;
    this.graph.data[0].y = this.variableNames;

    console.log(this.graph.data);
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getViewColumns(this.collectionName);
    this.reloadData();
  }


}
