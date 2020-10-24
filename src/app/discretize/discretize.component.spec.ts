import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscretizeComponent } from './discretize.component';

describe('DiscretizeComponent', () => {
  let component: DiscretizeComponent;
  let fixture: ComponentFixture<DiscretizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscretizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscretizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
