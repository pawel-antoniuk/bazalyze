import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

  constructor(public dataService: DataService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

  loadRecentDataset(collectionName: string) {
    this.dataService.loadSavedCollection(collectionName);
    this.dashboardService.addComponent(collectionName, DataTableComponent, component => {
      component.instance.collectionName = collectionName;
    });
  }

  getCollectionNames() {
    return this.dataService.getSavedCollectionNames().sort((a, b) => {
      return this.dataService.getSavedCollectionDate(b).getTime()
        - this.dataService.getSavedCollectionDate(a).getTime()
    });
  }

  getCollectionDate(collectionName: string) {
    const date = this.dataService.getSavedCollectionDate(collectionName);
    return date.toLocaleString('pl');
  }

}
