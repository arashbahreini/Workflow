import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTaskGraphComponent } from './pending-task-graph.component';

describe('PendingTaskGraphComponent', () => {
  let component: PendingTaskGraphComponent;
  let fixture: ComponentFixture<PendingTaskGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTaskGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTaskGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
