import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitEditPage } from './unit-edit.page';

describe('UnitEditPage', () => {
  let component: UnitEditPage;
  let fixture: ComponentFixture<UnitEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
