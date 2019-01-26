import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleEngineManagementComponent } from './rule-engine-management.component';


describe('RuleEngineAssignmentComponent', () => {
  let component: RuleEngineManagementComponent;
  let fixture: ComponentFixture<RuleEngineManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleEngineManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleEngineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
