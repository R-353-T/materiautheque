import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldCreatePage } from './field-create.page';

describe('FieldCreatePage', () => {
  let component: FieldCreatePage;
  let fixture: ComponentFixture<FieldCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
