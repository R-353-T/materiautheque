import { TestBed } from '@angular/core/testing';

import { TemplateFieldService } from './template-field.service';

describe('TemplateFieldService', () => {
  let service: TemplateFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
