import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleEngineTestComponent } from './rule-engine-test.component';

describe('RuleEngineTestComponent', () => {
  let component: RuleEngineTestComponent;
  let fixture: ComponentFixture<RuleEngineTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleEngineTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleEngineTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
