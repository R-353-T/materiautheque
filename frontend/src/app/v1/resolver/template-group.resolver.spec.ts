import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { templateGroupResolver } from './template-group.resolver';

describe('templateGroupResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => templateGroupResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
