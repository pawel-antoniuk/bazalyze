import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { DashboardService } from './dashboard.service';
import { DataTableComponent } from './data-table/data-table.component';
import { DataService } from './data.service';
import { HeaderSelectorComponent } from './header-selector/header-selector.component';
import { SelectIndexComponent } from './select-index/select-index.component';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private dashboardService: DashboardService) { }

  public loadFile(file: File) {
    this.dialog.open(HeaderSelectorComponent, {

    }).afterClosed().subscribe(importSettings => {
      if (importSettings === undefined) {
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

  public loadAsset(url: string, assetName: string) {
    this.dialog.open(HeaderSelectorComponent, {

    }).afterClosed().subscribe(importSettings => {
      if (importSettings === undefined) {
        return;
      }

      this.data.loadDataFromAssets(url, assetName, importSettings,
        (headers, proposedIndices, save) => {
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

}
