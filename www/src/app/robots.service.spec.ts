import { TestBed, inject } from '@angular/core/testing';

import { RobotsService } from './robots.service';

describe('RobotsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RobotsService]
    });
  });

  it('should ...', inject([RobotsService], (service: RobotsService) => {
    expect(service).toBeTruthy();
  }));
});
