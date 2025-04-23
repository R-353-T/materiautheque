import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateImagePage } from './create-image.page';

describe('CreateImagePage', () => {
  let component: CreateImagePage;
  let fixture: ComponentFixture<CreateImagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
