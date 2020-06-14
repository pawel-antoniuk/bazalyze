import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { PlotlyModule, PlotComponent } from 'angular-plotly.js';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit {

  @ViewChild(PlotComponent, { static: true })
  plotly: PlotComponent;

  collectionNames: string[] = [];
  variableNames: string[] = [];

  collectionName: string = '';
  binSize = 1;
  xVariables: [{ name: string}] = [{ name: ''}];

  public graph = {
    layout: {
      width: 800, height: 600,
      margin: { l: 40, r: 10, t: 20, b: 40 },
      yaxis: { title: { text: 'Count' } },
    }
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getCollectionNames();
  }


  reloadData() {
    if (!this.collectionName) {
      return;
    }

    let dataLists = [];
    let usedVariableNames: string[] = [];

    for (let xVariable of this.xVariables) {
      if (!xVariable.name) {
        continue;
      }

      let data = {
        name: xVariable.name,
        type: 'histogram',
        xbins: {
          size: this.binSize
        }
      }

      data["x"] = this.dataService.getCollectionDefaultView(this.collectionName).chain()
        .find()
        .mapReduce(o => o[xVariable.name], a => a);

      dataLists.push(data);
      usedVariableNames.push(xVariable.name);
    }

    this.plotly.data = dataLists;

    this.configureLayout(usedVariableNames);
  }

  configureLayout(usedVariableNames: string[]) {
    let layout = {
      ...this.graph.layout,
      xaxis: { title: { text: usedVariableNames.join(' + ') } },
    };

    this.plotly.layout = layout;
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getCollectionDefaultViewColumns(this.collectionName);
    this.xVariables = [{ name: ''}];
    this.reloadData();
  }

  onVariableSelectionChange(variableKey, event: MatSelectChange) {
    let variable = this.xVariables.find(v => v.name == variableKey);
    variable.name = event.value;

    this.reloadData();
  }

  onChangeBinSize() {
    this.reloadData();
  }

  addVariable() {
    this.xVariables.push({ name: '' });
  }
}
