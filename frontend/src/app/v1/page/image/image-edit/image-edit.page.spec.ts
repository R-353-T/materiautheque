import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageEditPage } from './image-edit.page';

describe('ImageEditPage', () => {
  let component: ImageEditPage;
  let fixture: ComponentFixture<ImageEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
