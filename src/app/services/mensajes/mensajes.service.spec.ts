import { TestBed } from '@angular/core/testing';

import { MensjajesService } from './mensjajes.service';

describe('MensjajesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MensjajesService = TestBed.get(MensjajesService);
    expect(service).toBeTruthy();
  });
});
