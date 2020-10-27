import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CloneableDashboardItem } from '../dashboard-item/dashboard-item.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, CloneableDashboardItem<DataTableComponent> {

  @Input()
  collectionName: string;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  records: any[];
  columns: string[];
  indices: string[];
  dataSource: MatTableDataSource<any>;
  collectionViewNames: string[] = [];
  selectedViewName: string;

  constructor(private dataService: DataService) { }

  ngOnDestroy(): void {
    this.dataService.removeCollectionHandle(this.collectionName);
  }

  ngOnInit(): void {
    if (!this.selectedViewName) {
      this.selectedViewName = this.dataService.getCollectionViewNames(this.collectionName)[0];
    }
    this.onDataUpdate();
  }

  onDataUpdate() {
    this.columns = this.dataService.getViewColumns(this.selectedViewName);
    this.indices = this.dataService.getViewIndices(this.selectedViewName);
    const data = this.dataService.getViewEntries(this.selectedViewName, -1);
    this.dataService.onCollectionUpdate(this.collectionName, () => this.onDataUpdate());

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.collectionViewNames = this.dataService.getCollectionViewNames(this.collectionName);
  }

  onCollectionViewSelected() {
    this.onDataUpdate();
  }

  cloneComponent(otherComponentInstance: DataTableComponent) {
    otherComponentInstance.collectionName = this.collectionName;
    otherComponentInstance.selectedViewName = this.selectedViewName;
    this.dataService.addCollectionHandle(this.collectionName);
  }

  saveComponent() {
    const content = this.dataService.getViewaAsCsv(this.selectedViewName);
    var a = document.createElement('a');
    var file = new Blob([content], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = `${this.selectedViewName}.csv`;
    a.click();
  }

  onViewDelete() {
    const availableViewNames = this.dataService.getCollectionViewNames(this.collectionName);
    const currentViewNameIndex = availableViewNames.findIndex(v => v == this.selectedViewName);
    let newViewName: string;

    if (currentViewNameIndex > 0) {
      newViewName = availableViewNames[currentViewNameIndex - 1];
    } else {
      newViewName = availableViewNames[currentViewNameIndex + 1]
    }

    const oldSelectedViewName = this.selectedViewName;
    this.selectedViewName = newViewName;
    this.dataService.removeView(oldSelectedViewName);
  }

  onCellClick(event, row, col) {
    const input = document.createElement('input');
    input.style.width = event.target.getBoundingClientRect().width - 10 + 'px';
    input.style.height = 20 + 'px';
    input.style.border = 'none';
    input.value = row[col];
    event.target.innerHTML = '';
    event.target.style.padding = '2px';
    event.target.append(input);
    input.focus();

    input.onblur = () => {
      const newValue = input.value;
      event.target.innerHTML = newValue;
      event.target.style.padding = '';
      row[col] = newValue;
    }
  }

}
