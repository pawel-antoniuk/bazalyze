import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { PlotlyModule, PlotComponent } from 'angular-plotly.js';
import { MatSelectChange } from '@angular/material/select';
import { DashboardService } from '../dashboard.service';
import { min, max, variance, sampleStandardDeviation, mean, mode, quantile, sampleSkewness } from 'simple-statistics'

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit {

  @ViewChild(PlotComponent, { static: true })
  plotly: PlotComponent;

  collectionNames: string[] = [];
  bins: number | undefined;
  normalized: boolean = false;

  selectedVariables: [{
    dataset: string,
    selectedVariableName: string,
    variableNames: string[]
  }] = [{
    dataset: '',
    selectedVariableName: '',
    variableNames: []
  }];

  public graph = {
    layout: {
      width: 800, height: 600,
      margin: { l: 40, r: 10, t: 20, b: 40 },
      yaxis: { title: { text: 'Count' } },
    },
    data: []
  };

  constructor(private dataService: DataService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getViewNames();
  }


  reloadData() {
    this.graph.data = [];

    if (this.selectedVariables.length <= 0) {
      return;
    }

    let usedVariableNames: string[] = [];

    for (let variable of this.selectedVariables) {
      if (!variable.selectedVariableName
        || !variable.dataset) {
        continue;
      }

      const columnValues = this.dataService.getView(variable.dataset).chain()
        .where(o => o[variable.selectedVariableName] != null)
        .mapReduce(o => o[variable.selectedVariableName], a => a);
      const minValue = min(columnValues);
      const maxValue = max(columnValues);

      if(this.bins == undefined) {
        this.bins = Math.floor(Math.sqrt(columnValues.length));
      }

      let data = {
        name: `${variable.dataset}[${variable.selectedVariableName}]`,
        type: 'histogram',
        xbins: {
          size: (maxValue - minValue) / (this.bins - 1)
        }
      }

      if (this.normalized) {
        data['histnorm'] = 'probability';
      }

      data["x"] = this.dataService.getView(variable.dataset).chain()
        .find()
        .mapReduce(o => o[variable.selectedVariableName], a => a);

      this.graph.data.push(data);
      usedVariableNames.push(variable.selectedVariableName);
    }

    this.configureLayout(usedVariableNames);
    this.dashboardService.setSuheader(this, `${this.selectedVariables.map(v => v.dataset).join(', ')}`);
  }

  configureLayout(usedVariableNames: string[]) {
    this.graph.layout["xaxis"] = { title: { text: usedVariableNames.join(' + ') } }
  }

  onDatasetSelectionChange(variableIndex: number, event: MatSelectChange) {
    let variable = this.selectedVariables[variableIndex];
    variable.dataset = event.value;
    variable.selectedVariableName = '';
    variable.variableNames = this.dataService.getViewColumns(variable.dataset);

    this.reloadData();
  }

  onVariableSelectionChange(variableIndex: number, event: MatSelectChange) {
    let variable = this.selectedVariables[variableIndex];
    variable.selectedVariableName = event.value;

    this.reloadData();
  }

  onChangeBinSize() {
    this.reloadData();
  }

  addVariable() {
    this.selectedVariables.push({ dataset: '', selectedVariableName: '', variableNames: [] });
  }
}
