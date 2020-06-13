import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.columns = this.dataService.getCollectionColumns(this.collectionName);
    this.indices = this.dataService.getCollectionIndices(this.collectionName);
    const data = this.dataService.getCollectionEntries(this.collectionName, -1);
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
