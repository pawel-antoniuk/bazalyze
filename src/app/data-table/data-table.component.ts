import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input()
  collectionName: string;

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  records: any[];
  columns: string[];
  indices: string[];
  dataSource: MatTableDataSource<any>;
  collectionViewNames: string[];
  selectedColectionViewName: string;

  constructor(private dataService: DataService) { }
  ngOnDestroy(): void {
    this.dataService.removeCllection(this.collectionName);
  }

  ngOnInit(): void {
    this.onDataUpdate();
  }

  onDataUpdate() {
    this.selectedColectionViewName = this.dataService.getCollectionSelectedViewName(this.collectionName);

    this.columns = this.dataService.getViewColumns(this.selectedColectionViewName);
    this.indices = this.dataService.getViewIndices(this.selectedColectionViewName);
    const data = this.dataService.getViewEntries(this.selectedColectionViewName, -1);
    this.dataService.onCollectionUpdate(this.collectionName, () => this.onDataUpdate());

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.collectionViewNames = this.dataService.getCollectionViewNames(this.collectionName);

  }

  onCollectionViewSelected() {
    this.dataService.selecetCollectionView(this.collectionName, this.selectedColectionViewName);
    this.onDataUpdate();
  }

}
