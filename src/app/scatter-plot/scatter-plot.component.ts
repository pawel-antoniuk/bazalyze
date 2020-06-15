import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { PlotlyModule, PlotComponent } from 'angular-plotly.js';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnInit {

  @ViewChild(PlotComponent, { static: true })
  plotly: PlotComponent;

  collectionNames: string[] = [];
  variableNames: string[] = [];

  collectionName: string = '';
  xVariableName: string = '';
  yVariableName: string = '';
  zVariableName: string = '';
  limit: number = 1000;
  keepAspectRation: boolean = false;

  public graph: any = {
    layout: {
      width: 800, height: 600,
      margin: { l: 40, r: 10, t: 10, b: 40 }
    },
    data: []
  };

  constructor(private dataService: DataService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getViewNames();
  }


  reloadData() {
    this.graph.data = [];

    if (!this.collectionName
      || !this.xVariableName
      || !this.yVariableName
      || this.limit <= 0) {
      return;
    }

    this.graph.data[0] = { type: 'scattergl', mode: 'markers' };

    this.graph.data[0]["x"] = this.dataService.getView(this.collectionName).chain()
      .find()
      .limit(this.limit)
      .mapReduce(o => o[this.xVariableName], a => a);

      this.graph.data[0]["y"] = this.dataService.getView(this.collectionName).chain()
      .find()
      .limit(this.limit)
      .mapReduce(o => o[this.yVariableName], a => a);

    if (this.zVariableName) {
      this.graph.data[0]["z"] = this.dataService.getView(this.collectionName).chain()
        .find()
        .limit(this.limit)
        .mapReduce(o => o[this.zVariableName], a => a);

        this.graph.data[0]["type"] = "scatter3d";
    }

    this.configureLayout();
    this.dashboardService.setSuheader(this, `${this.collectionName}`);
  }

  configureLayout() {
    this.graph.layout = {
      ...this.graph.layout,
      xaxis: { title: { text: this.xVariableName } },
      yaxis: { title: { text: this.yVariableName } },
      zaxis: { title: { text: this.zVariableName } }
    };

    if (this.keepAspectRation) {
      this.graph.layout.xaxis["constrain"] = 'domain';
      this.graph.layout.yaxis["scaleanchor"] = 'x';
      this.graph.layout.zaxis["scaleanchor"] = 'x';
      this.graph.layout["scene"] = {aspectmode: 'data'};
    } else {
      delete this.graph.layout.xaxis["constrain"];
      delete this.graph.layout.yaxis["scaleanchor"];
      delete this.graph.layout.zaxis["scaleanchor"];
      delete this.graph.layout['scene'];
    }
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getViewColumns(this.collectionName);
    this.xVariableName = '';
    this.yVariableName = '';
    this.zVariableName = '';
    this.reloadData();
  }

}
