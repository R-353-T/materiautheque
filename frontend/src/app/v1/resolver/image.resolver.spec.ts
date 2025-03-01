import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { imageResolver } from './image.resolver';

describe('imageResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => imageResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
