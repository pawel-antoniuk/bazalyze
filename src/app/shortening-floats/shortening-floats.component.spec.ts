import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorteningFloatsComponent } from './shortening-floats.component';

describe('ShorteningFloatsComponent', () => {
  let component: ShorteningFloatsComponent;
  let fixture: ComponentFixture<ShorteningFloatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShorteningFloatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShorteningFloatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
