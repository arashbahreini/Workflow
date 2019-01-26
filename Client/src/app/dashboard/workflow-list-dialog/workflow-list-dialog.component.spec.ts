import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowListDialogComponent } from './workflow-list-dialog.component';

describe('WorkflowListDialogComponent', () => {
  let component: WorkflowListDialogComponent;
  let fixture: ComponentFixture<WorkflowListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
