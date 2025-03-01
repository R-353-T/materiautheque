import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { enumeratorResolver } from './enumerator.resolver';

describe('enumeratorResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => enumeratorResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
