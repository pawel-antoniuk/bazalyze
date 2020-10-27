import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './alert/alert.component';
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

      this.data.loadDataFromFile(file, importSettings, (result) => {
        if (!result.success) {
          this.dialog.open(AlertComponent, {
            data: {
              title: 'Error',
              message: 'Dataset has duplicated column names'
            }
          });
          return;
        }

        this.dialog.open(SelectIndexComponent, {
          data: {
            headers: result.headers,
            proposedIndices: result.proposedIndices
          }
        }).afterClosed().subscribe(indices => {
          if (indices === null || Array.isArray(indices)) {
            result.save(indices, (collectionName) => {
              this.dashboardService.addComponent(collectionName, DataTableComponent, component => {
                component.instance.collectionName = collectionName;
              });
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
        (result) => {
          if (!result.success) {
            this.dialog.open(AlertComponent, {
              data: {
                title: 'Error',
                message: 'Dataset has duplicated column names'
              }
            });
            return;
          }

          this.dialog.open(SelectIndexComponent, {
            data: {
              headers: result.headers,
              proposedIndices: result.proposedIndices
            }
          }).afterClosed().subscribe(indices => {
            if (indices === null || Array.isArray(indices)) {
              result.save(indices, (collectionName) => {
                this.dashboardService.addComponent(collectionName, DataTableComponent, component => {
                  component.instance.collectionName = collectionName;
                });
              });
            }
          });
        });
    });
  }
}
