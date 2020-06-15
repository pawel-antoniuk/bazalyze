import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameCategoriesComponent } from './rename-categories.component';

describe('RenameCategoriesComponent', () => {
  let component: RenameCategoriesComponent;
  let fixture: ComponentFixture<RenameCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
