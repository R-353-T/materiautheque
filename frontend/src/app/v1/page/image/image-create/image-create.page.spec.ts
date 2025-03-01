import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCreatePage } from './image-create.page';

describe('ImageCreatePage', () => {
  let component: ImageCreatePage;
  let fixture: ComponentFixture<ImageCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
