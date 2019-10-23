import { TestBed } from '@angular/core/testing';

import { FiredatabaseService } from './firedatabase.service';

describe('FiredatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiredatabaseService = TestBed.get(FiredatabaseService);
    expect(service).toBeTruthy();
  });
});
