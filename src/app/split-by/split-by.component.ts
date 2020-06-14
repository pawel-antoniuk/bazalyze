import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-split-by',
  templateUrl: './split-by.component.html',
  styleUrls: ['./split-by.component.scss']
})
export class SplitByComponent implements OnInit {

  collectionNames: string[] = [];
  variableNames: string[] = [];

  collectionName: string;
  variableName: string;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.collectionNames = this.dataService.getCollectionNames();
  }

  onDatasetSelectionChange() {
    this.variableNames = this.dataService.getCollectionDefaultViewColumns(this.collectionName);
    this.variableName = '';
  }

  onAccept() {
    console.log('accept');
  }

}
