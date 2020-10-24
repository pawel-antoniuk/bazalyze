import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetAndVariablesSelectorComponent } from './dataset-and-variables-selector.component';

describe('DatasetAndVariablesSelectorComponent', () => {
  let component: DatasetAndVariablesSelectorComponent;
  let fixture: ComponentFixture<DatasetAndVariablesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetAndVariablesSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetAndVariablesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
