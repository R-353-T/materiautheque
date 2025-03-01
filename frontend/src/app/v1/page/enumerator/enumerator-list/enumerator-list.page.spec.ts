import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnumeratorListPage } from './enumerator-list.page';

describe('EnumeratorListPage', () => {
  let component: EnumeratorListPage;
  let fixture: ComponentFixture<EnumeratorListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumeratorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
