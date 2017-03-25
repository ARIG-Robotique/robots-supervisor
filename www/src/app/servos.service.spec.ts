import { TestBed, inject } from '@angular/core/testing';

import { ServosService } from './servos.service';

describe('ServosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServosService]
    });
  });

  it('should ...', inject([ServosService], (service: ServosService) => {
    expect(service).toBeTruthy();
  }));
});
