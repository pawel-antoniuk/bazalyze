import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { PlotlyModule, PlotComponent } from 'angular-plotly.js';
import { DashboardService } from '../dashboard.service';

const plotColors = [
  '#00dd00',  '#ff0000',  '#00ffff',  '#008000',
  '#ffb6c1',  '#f0ffff',  '#00ffff',  '#e9967a',
  '#d3d3d3',  '#006400',  '#a52a2a',  '#0000ff',
  '#800080',  '#556b2f',  '#800000',  '#808000',
  '#ff00ff',  '#f0e68c',  '#ffa500',  '#a9a9a9',
  '#4b0082',  '#008b8b',  '#00ff00',  '#9400d3',
  '#000000',  '#8b0000',  '#00008b',  '#000080',
  '#ffffff',  '#ffffe0',  '#e0ffff',  '#ffff00',
  '#800080',  '#ffc0cb',  '#c0c0c0',  '#90ee90',
  '#9932cc',  '#f5f5dc',  '#ff00ff',  '#bdb76b',
  '#8b008b',  '#ffd700',  '#ff8c00',  '#add8e6'
];

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
  classVariableName: string = '';
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

    this.graph.data[0] = { type: 'scattergl', mode: 'markers', marker: {} };

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

    if(this.classVariableName) {
      const classValues = this.dataService.getView(this.collectionName).chain()
        .find()
        .limit(this.limit)
        .mapReduce(o => o[this.classVariableName], a => a);

      let categoricalValues = {};
      let categoricalIndex = 0;

      classValues.forEach(classValue => {
        if(!(classValue in categoricalValues)) {
          categoricalValues[classValue] = categoricalIndex;
          categoricalIndex += 1;
        }
      });

      const colorValues = classValues.map(classValue => {
        return plotColors[categoricalValues[classValue]];
      });

      this.graph.data[0]['marker']["color"] = colorValues;
      this.graph.data[0]["text"] = classValues;
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
