import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitListPage } from './unit-list.page';

describe('UnitListPage', () => {
  let component: UnitListPage;
  let fixture: ComponentFixture<UnitListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
