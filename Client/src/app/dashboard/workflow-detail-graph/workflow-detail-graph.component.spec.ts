import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailGraphComponent } from './workflow-detail-graph.component';

describe('WorkflowDetailGraphComponent', () => {
  let component: WorkflowDetailGraphComponent;
  let fixture: ComponentFixture<WorkflowDetailGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDetailGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
