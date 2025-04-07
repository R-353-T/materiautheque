import { TestBed } from '@angular/core/testing';

import { MateApiService } from './mate-api.service';

describe('MateApiService', () => {
  let service: MateApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
