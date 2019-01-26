import { TestBed, inject } from '@angular/core/testing';
import { CommonServicesService } from './common-services.service';


describe('CommonServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonServicesService]
    });
  });

  it('should be created', inject([CommonServicesService], (service: CommonServicesService) => {
    expect(service).toBeTruthy();
  }));
});
