import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRuleItemsComponent } from './show-rule-items.component';

describe('ShowRuleItemsComponent', () => {
  let component: ShowRuleItemsComponent;
  let fixture: ComponentFixture<ShowRuleItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRuleItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRuleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
