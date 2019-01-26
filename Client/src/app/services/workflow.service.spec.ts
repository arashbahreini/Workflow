import { TestBed, inject } from '@angular/core/testing';

import { workflowService } from './workflow.service';

describe('workflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [workflowService]
    });
  });

  it('should be created', inject([workflowService], (service: workflowService) => {
    expect(service).toBeTruthy();
  }));
});
