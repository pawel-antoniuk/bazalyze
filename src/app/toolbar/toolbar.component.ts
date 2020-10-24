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
import { UpdateComponent } from '../update/update.component';
import { RenameColumnsComponent } from '../rename-columns/rename-columns.component';
import { JoinComponent } from '../join/join.component';
import { FillEmptyValuesComponent } from '../fill-empty-values/fill-empty-values.component';
import { RenameCategoriesComponent } from '../rename-categories/rename-categories.component';
import { GroupComponent } from '../group/group.component';
import { CorrelationMatrixComponent } from '../correlation-matrix/correlation-matrix.component';
import { SampleDataComponent } from '../sample-data/sample-data.component';
import { ShorteningFloatsComponent } from '../shortening-floats/shortening-floats.component';
import { FilterComponent } from '../filter/filter.component';
import { HeaderSelectorComponent } from '../header-selector/header-selector.component';
import { ToNumericalComponent } from '../to-numerical/to-numerical.component';
import { DiscretizeComponent } from '../discretize/discretize.component';
import { NormalizeComponent } from '../normalize/normalize.component';
import { ConvertNumberRangeComponent } from '../convert-number-range/convert-number-range.component';

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

    this.dialog.open(HeaderSelectorComponent, {

    }).afterClosed().subscribe(importSettings => {
      if(importSettings === undefined) {
        return;
      }

      this.data.loadDataFromFile(file, importSettings, (headers, proposedIndices, save) => {
        this.dialog.open(SelectIndexComponent, {
          data: { headers, proposedIndices }
        }).afterClosed().subscribe(result => {
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

    });

  }

  openToNumerical() {
    this.dialog.open(ToNumericalComponent);
  }

  openDiscretize() {
    this.dialog.open(DiscretizeComponent);
  }

  openNormalize() {
    this.dialog.open(NormalizeComponent);
  }

  openConvertRange() {
    this.dialog.open(ConvertNumberRangeComponent);
  }

  openScatterPlot() {
    this.dashboardService.addComponent('Scatter plot', ScatterPlotComponent, () => { });
  }

  openHistogram() {
    this.dashboardService.addComponent('Histogram', HistogramComponent, () => { });
  }

  openCorrelationMatrix()  {
    this.dashboardService.addComponent('Correlation matrix', CorrelationMatrixComponent, () => { });
  }

  openStatistics() {
    this.dashboardService.addComponent('Statistics', StatisticsComponent, () => { });
  }

  openSampleData() {
    this.dialog.open(SampleDataComponent);
  }

  openFilter() {
    this.dialog.open(FilterComponent);
  }

  openSplitBy() {
    this.dialog.open(SplitByComponent);
  }

  openUpdate() {
    this.dialog.open(UpdateComponent);
  }

  openRenameColumns() {
    this.dialog.open(RenameColumnsComponent);
  }

  openJoin() {
    this.dialog.open(JoinComponent);
  }

  openFillEmptyValues() {
    this.dialog.open(FillEmptyValuesComponent);
  }

  openShortenFloats() {
    this.dialog.open(ShorteningFloatsComponent);
  }

  openRenameCategories() {
    this.dialog.open(RenameCategoriesComponent);
  }

  openGroup() {
    this.dialog.open(GroupComponent);
  }

}
