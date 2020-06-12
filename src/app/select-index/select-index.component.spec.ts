import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIndexComponent } from './select-index.component';

describe('SelectIndexComponent', () => {
  let component: SelectIndexComponent;
  let fixture: ComponentFixture<SelectIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
