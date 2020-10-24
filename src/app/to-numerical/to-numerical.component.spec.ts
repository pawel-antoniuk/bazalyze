import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToNumericalComponent } from './to-numerical.component';

describe('ToNumericalComponent', () => {
  let component: ToNumericalComponent;
  let fixture: ComponentFixture<ToNumericalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToNumericalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToNumericalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
