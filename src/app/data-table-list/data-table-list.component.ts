import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-table-list',
  templateUrl: './data-table-list.component.html',
  styleUrls: ['./data-table-list.component.scss']
})
export class DataTableListComponent implements OnInit {

  @Input()
  collectionNames: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
