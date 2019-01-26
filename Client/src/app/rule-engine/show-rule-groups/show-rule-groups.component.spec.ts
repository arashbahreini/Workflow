import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRuleGroupsComponent } from './show-rule-groups.component';

describe('ShowRuleGroupsComponent', () => {
  let component: ShowRuleGroupsComponent;
  let fixture: ComponentFixture<ShowRuleGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRuleGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRuleGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
