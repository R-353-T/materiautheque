import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnumeratorPage } from './enumerator.page';

describe('EnumeratorPage', () => {
  let component: EnumeratorPage;
  let fixture: ComponentFixture<EnumeratorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumeratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
