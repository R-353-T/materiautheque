import { TestBed } from '@angular/core/testing';

import { TemplateGroupService } from './template-group.service';

describe('TemplateGroupService', () => {
  let service: TemplateGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
