import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldEditPage } from './field-edit.page';

describe('FieldEditPage', () => {
  let component: FieldEditPage;
  let fixture: ComponentFixture<FieldEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
