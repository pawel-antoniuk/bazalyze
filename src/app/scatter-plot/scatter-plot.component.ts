import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { PlotlyModule, PlotComponent } from 'angular-plotly.js';

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

  public graph = {
    layout: {
      width: 800, height: 600,
      margin: { l: 40, r: 10, t: 10, b: 40 }
    }
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getCollectionNames();
  }


  reloadData() {
    if (!this.collectionName
      || !this.xVariableName
      || !this.yVariableName
      || this.limit <= 0) {
      return;
    }

    let data = { type: 'scatter', mode: 'markers' }

    data["x"] = this.dataService.getCollection(this.collectionName).chain()
      .find()
      .limit(this.limit)
      .mapReduce(o => o[this.xVariableName], a => a);

    data["y"] = this.dataService.getCollection(this.collectionName).chain()
      .find()
      .limit(this.limit)
      .mapReduce(o => o[this.yVariableName], a => a);

    if (this.zVariableName) {
      data["z"] = this.dataService.getCollection(this.collectionName).chain()
        .find()
        .limit(this.limit)
        .mapReduce(o => o[this.zVariableName], a => a);

      data["type"] = "scatter3d";
    }

    this.plotly.data = [data];
    this.configureLayout();
  }

  configureLayout() {
    let layout = {
      ...this.graph.layout,
      xaxis: { title: { text: this.xVariableName } },
      yaxis: { title: { text: this.yVariableName } },
      zaxis: { title: { text: this.zVariableName } }
    };

    if (this.keepAspectRation) {
      layout.xaxis["constrain"] = 'domain';
      layout.yaxis["scaleanchor"] = 'x';
      layout.zaxis["scaleanchor"] = 'x';
    }

    this.plotly.layout = layout;
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getCollectionColumns(this.collectionName);
    this.xVariableName = '';
    this.yVariableName = '';
    this.zVariableName = '';
    this.reloadData();
  }

}
