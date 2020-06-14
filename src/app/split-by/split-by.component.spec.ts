import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitByComponent } from './split-by.component';

describe('SplitByComponent', () => {
  let component: SplitByComponent;
  let fixture: ComponentFixture<SplitByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
