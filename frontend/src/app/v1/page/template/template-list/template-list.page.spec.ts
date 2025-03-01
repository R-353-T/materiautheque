import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateListPage } from './template-list.page';

describe('TemplateListPage', () => {
  let component: TemplateListPage;
  let fixture: ComponentFixture<TemplateListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
