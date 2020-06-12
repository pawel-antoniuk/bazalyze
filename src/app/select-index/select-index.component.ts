import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  headers: string[]
}

@Component({
  selector: 'app-select-index',
  templateUrl: './select-index.component.html',
  styleUrls: ['./select-index.component.scss']
})
export class SelectIndexComponent implements OnInit {

  headers = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SelectIndexComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
