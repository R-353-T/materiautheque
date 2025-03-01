import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { templateFieldResolver } from './template-field.resolver';

describe('templateFieldResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => templateFieldResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
