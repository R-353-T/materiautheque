import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { formResolver } from './form.resolver';

describe('formResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => formResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
