import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRules.DialogComponent } from './show-rules.dialog.component';

describe('ShowRules.DialogComponent', () => {
  let component: ShowRules.DialogComponent;
  let fixture: ComponentFixture<ShowRules.DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRules.DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRules.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
