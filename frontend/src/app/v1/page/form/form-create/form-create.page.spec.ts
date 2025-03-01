import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCreatePage } from './form-create.page';

describe('FormCreatePage', () => {
  let component: FormCreatePage;
  let fixture: ComponentFixture<FormCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
