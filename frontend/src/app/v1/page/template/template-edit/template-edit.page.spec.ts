import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateEditPage } from './template-edit.page';

describe('TemplateEditPage', () => {
  let component: TemplateEditPage;
  let fixture: ComponentFixture<TemplateEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
