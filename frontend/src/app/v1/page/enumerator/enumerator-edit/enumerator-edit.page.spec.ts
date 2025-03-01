import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnumeratorEditPage } from './enumerator-edit.page';

describe('EnumeratorEditPage', () => {
  let component: EnumeratorEditPage;
  let fixture: ComponentFixture<EnumeratorEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumeratorEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
