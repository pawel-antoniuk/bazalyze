import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header-selector',
  templateUrl: './header-selector.component.html',
  styleUrls: ['./header-selector.component.scss']
})
export class HeaderSelectorComponent implements OnInit {

  hasHeader = new FormControl(true);
  generateIndex = new FormControl(true);

  constructor() { }

  ngOnInit(): void {
  }

}
