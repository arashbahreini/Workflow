import { TestBed, inject } from '@angular/core/testing';

import { RuleEngineService } from './rule-engine.service';

describe('RuleEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuleEngineService]
    });
  });

  it('should be created', inject([RuleEngineService], (service: RuleEngineService) => {
    expect(service).toBeTruthy();
  }));
});
