import { Component } from '@angular/core';
import { DataService } from './data.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectIndexComponent } from './select-index/select-index.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bazalyze';

  collectionNames: string[];

  constructor(private data: DataService, private dialog: MatDialog) {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    const file = inputNode.files[0];

    this.data.loadData(file, (headers, save) => {

      const dialogRef = this.dialog.open(SelectIndexComponent, {
        width: '250px',
        data: { headers: headers }
      });

      dialogRef.afterClosed().subscribe(result => {
        save(result, () => {
          this.collectionNames = this.data.getCollectionNames();
        });
      });
    });
  }
}
