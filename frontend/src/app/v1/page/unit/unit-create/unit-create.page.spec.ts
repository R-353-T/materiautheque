import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitCreatePage } from './unit-create.page';

describe('UnitCreatePage', () => {
  let component: UnitCreatePage;
  let fixture: ComponentFixture<UnitCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
