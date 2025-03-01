import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { unitResolver } from './unit.resolver';

describe('unitResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => unitResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
