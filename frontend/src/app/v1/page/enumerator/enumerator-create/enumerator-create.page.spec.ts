import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnumeratorCreatePage } from './enumerator-create.page';

describe('EnumeratorCreatePage', () => {
  let component: EnumeratorCreatePage;
  let fixture: ComponentFixture<EnumeratorCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumeratorCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
