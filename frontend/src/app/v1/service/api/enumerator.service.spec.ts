import { TestBed } from '@angular/core/testing';

import { EnumeratorService } from './enumerator.service';

describe('EnumeratorService', () => {
  let service: EnumeratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnumeratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
