import { TestBed, inject } from '@angular/core/testing';

import { BasicInformationService } from './basic-information.service';

describe('BasicInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicInformationService]
    });
  });

  it('should be created', inject([BasicInformationService], (service: BasicInformationService) => {
    expect(service).toBeTruthy();
  }));
});
