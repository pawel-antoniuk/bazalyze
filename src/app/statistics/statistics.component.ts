import { Component, OnInit, ViewChild } from '@angular/core';
import { PlotComponent } from 'angular-plotly.js';
import { DataService } from '../data.service';
import { MatSelectChange } from '@angular/material/select';
import { min, max, variance, sampleStandardDeviation, mean, mode, quantile, sampleSkewness } from 'simple-statistics'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(PlotComponent, { static: true })
  plotly: PlotComponent;

  collectionNames: string[] = [];
  variableNames: string[] = [];

  collectionName: string = '';
  variableName: string = '';

  statisticsValues: { name: string, value: string }[] = [];

  variablesCount: number;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getViewNames();
  }

  reloadData() {
    if (!this.collectionName
      || !this.variableName) {
      return;
    }

    const values = this.dataService.getView(this.collectionName).chain()
      .where(o => o[this.variableName] != null)
      .mapReduce(o => o[this.variableName], a => a);

    const nulls = this.dataService.getView(this.collectionName)
      .where(o => o[this.variableName] == null).length;

    this.statisticsValues = [];
    this.setStatisticsIntegerValue('length', values.length);
    this.setStatisticsIntegerValue('nulls', nulls);
    this.setStatisticsValue('min', min(values));
    this.setStatisticsValue('max', max(values));
    this.setStatisticsValue('mean', mean(values));
    this.setStatisticsValue('variance', variance(values));
    this.setStatisticsValue('std dev', sampleStandardDeviation(values));
    this.setStatisticsValue('skewness', sampleSkewness(values));
    this.setStatisticsValue('mode', mode(values));
    this.setStatisticsValue('Q1', quantile(values, 0.25));
    this.setStatisticsValue('Q2', quantile(values, 0.5));
    this.setStatisticsValue('Q3', quantile(values, 0.75));
  }

  setStatisticsValue(statisticsName: string, statisticsValue: number) {
    this.statisticsValues.push({ name: statisticsName, value: statisticsValue?.toFixed(2) });
  }

  setStatisticsIntegerValue(statisticsName: string, statisticsValue: number) {
    this.statisticsValues.push({ name: statisticsName, value: statisticsValue.toString() });
  }

  onDatasetSelectionChange() {
    if(!this.collectionName) {
      return;
    }

    this.variableNames = this.dataService.getViewColumns(this.collectionName);
    this.variableName = '';
    this.variablesCount = this.variableNames.length;
    this.reloadData();
  }

  onVariableSelectionChange() {
    this.reloadData();
  }
}
