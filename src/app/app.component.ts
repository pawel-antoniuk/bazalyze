import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from './data.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectIndexComponent } from './select-index/select-index.component';
import { Overlay, RepositionScrollStrategy, GlobalPositionStrategy, ConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bazalyze';

  @ViewChild('button', { static: true }) private buttonRef: ElementRef<HTMLButtonElement>;

  collectionNames: string[];

  constructor(private overlay: Overlay) {
  }

  ngOnInit() {

  }

  onCollectionLoaded(collectionNames: string[]) {
    this.collectionNames = collectionNames;
  }
}
