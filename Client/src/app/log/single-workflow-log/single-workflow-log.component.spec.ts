import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWorkflowLogComponent } from './single-workflow-log.component';

describe('SingleWorkflowLogComponent', () => {
  let component: SingleWorkflowLogComponent;
  let fixture: ComponentFixture<SingleWorkflowLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleWorkflowLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleWorkflowLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
