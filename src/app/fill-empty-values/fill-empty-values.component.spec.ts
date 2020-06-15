import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillEmptyValuesComponent } from './fill-empty-values.component';

describe('FillEmptyValuesComponent', () => {
  let component: FillEmptyValuesComponent;
  let fixture: ComponentFixture<FillEmptyValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillEmptyValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillEmptyValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
