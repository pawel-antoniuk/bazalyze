import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BackgroundComponent } from './background/background.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { SelectIndexComponent } from './select-index/select-index.component';
import { DataTableComponent } from './data-table/data-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardItemComponent } from './dashboard-item/dashboard-item.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HistogramComponent } from './histogram/histogram.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SplitByComponent } from './split-by/split-by.component';
import { UpdateComponent } from './update/update.component';
import { AlertComponent } from './alert/alert.component';
import { RenameColumnsComponent } from './rename-columns/rename-columns.component';
import { JoinComponent } from './join/join.component';
import { FillEmptyValuesComponent } from './fill-empty-values/fill-empty-values.component';
import { RenameCategoriesComponent } from './rename-categories/rename-categories.component';
import { MatDividerModule } from '@angular/material/divider';
import { GroupComponent } from './group/group.component';
import { CorrelationMatrixComponent } from './correlation-matrix/correlation-matrix.component';
import { SampleDataComponent } from './sample-data/sample-data.component';
import { FrontComponent } from './front/front.component';
import { ShorteningFloatsComponent } from './shortening-floats/shortening-floats.component';
import { FilterComponent } from './filter/filter.component';
import { HeaderSelectorComponent } from './header-selector/header-selector.component';
import { ToNumericalComponent } from './to-numerical/to-numerical.component';
import { DiscretizeComponent } from './discretize/discretize.component';
import { DatasetAndVariablesSelectorComponent } from './dataset-and-variables-selector/dataset-and-variables-selector.component';
import { NormalizeComponent } from './normalize/normalize.component';
import { ConvertNumberRangeComponent } from './convert-number-range/convert-number-range.component';
import {MatListModule} from '@angular/material/list';

PlotlyViaCDNModule.plotlyVersion = '1.54.2';
PlotlyViaCDNModule.plotlyBundle = null;

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    SelectIndexComponent,
    DataTableComponent,
    ToolbarComponent,
    ScatterPlotComponent,
    DashboardComponent,
    DashboardItemComponent,
    HistogramComponent,
    StatisticsComponent,
    SplitByComponent,
    UpdateComponent,
    AlertComponent,
    RenameColumnsComponent,
    JoinComponent,
    FillEmptyValuesComponent,
    RenameCategoriesComponent,
    GroupComponent,
    CorrelationMatrixComponent,
    SampleDataComponent,
    FrontComponent,
    ShorteningFloatsComponent,
    FilterComponent,
    HeaderSelectorComponent,
    ToNumericalComponent,
    DiscretizeComponent,
    DatasetAndVariablesSelectorComponent,
    NormalizeComponent,
    ConvertNumberRangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    PlotlyViaCDNModule,
    OverlayModule,
    DragDropModule,
    FlexLayoutModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatRadioModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
