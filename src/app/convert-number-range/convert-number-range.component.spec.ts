import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertNumberRangeComponent } from './convert-number-range.component';

describe('ConvertNumberRangeComponent', () => {
  let component: ConvertNumberRangeComponent;
  let fixture: ComponentFixture<ConvertNumberRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertNumberRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertNumberRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
