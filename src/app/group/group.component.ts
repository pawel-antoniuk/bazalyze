import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SplitByComponent } from '../split-by/split-by.component';
import { DashboardService } from '../dashboard.service';
import { mean, median, mode, min, max, variance, sum } from 'simple-statistics'

const AggregationFunctions = {
  'mean': mean, 'median': median, 'mode': mode,
  'min': min, 'max': max, 'variance': variance,
  'sum': sum, 'count': (a: number[]) => a.length
};

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  availableAggregations: string[] = Object.keys(AggregationFunctions);
  viewNames: string[] = [];
  variableNames: string[] = [];
  selectedViewName: string;
  selectedVariableName: string;
  selectedAggregations: { [id: string]: { names: string[] } } = {};

  constructor(private dataService: DataService,
    private dialogRef: MatDialogRef<SplitByComponent>) { }

  ngOnInit(): void {
    this.viewNames = this.dataService.getViewNames();
    this.selectedViewName = '';
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getViewColumns(this.selectedViewName);
  }

  onVariableSelectionChange() {
    this.selectedAggregations = {};
    if (this.selectedVariableName) {
      this.variableNames.filter(v => v != this.selectedVariableName).forEach(v => {
        this.selectedAggregations[v] = { names: [] };
      });
    }
  }

  onAccept() {
    let groups: { [id: string]: any[] } = {};

    this.dataService.getView(this.selectedViewName).data.forEach(o => {
      if (!(o[this.selectedVariableName] in groups)) {
        groups[o[this.selectedVariableName]] = [];
      }
      groups[o[this.selectedVariableName]].push(o);
    });

    let aggregated:  { [id: string]: number | string }[] = [];

    for (let [gropValue, groupObjects] of Object.entries(groups)) {
      let aggregatedValues: { [id: string]: number | string } = {};
      aggregatedValues[this.selectedVariableName] = gropValue;

      for (let [variableName, aggregation] of Object.entries(this.selectedAggregations)) {
        aggregation.names.forEach(aggregationName => {
          const valuesToAggregate = groupObjects.filter(o => o[variableName] != null)
            .map(o => o[variableName]);
          let aggregationValue: number;
          if (valuesToAggregate.length > 0) {
            aggregationValue = +AggregationFunctions[aggregationName](valuesToAggregate).toFixed(2);
          } else {
            aggregationValue = null;
          }
          aggregatedValues[`${aggregationName}(${variableName})`] = aggregationValue;
        })
      }

      aggregated.push(aggregatedValues);
    }

    const collectionName = this.dataService.getViewNameCollection(this.selectedViewName);
    const viewName = `${this.selectedViewName} (by ${this.selectedVariableName})`;
    const indices = [...this.dataService.getViewIndices(this.selectedViewName), this.selectedVariableName];
    const newColumnNames = Object.keys(aggregated[0]);
    this.dataService.addCollectionView(collectionName, viewName, newColumnNames, indices, aggregated);
    this.dataService.collectionUpdated(collectionName);

    this.dialogRef.close();
  }
}
