import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldPage } from './field.page';

describe('FieldPage', () => {
  let component: FieldPage;
  let fixture: ComponentFixture<FieldPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
