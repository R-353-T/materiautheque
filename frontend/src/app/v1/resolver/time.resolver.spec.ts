import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { timeResolver } from './time.resolver';

describe('timeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => timeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
