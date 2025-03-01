import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageListPage } from './image-list.page';

describe('ImageListPage', () => {
  let component: ImageListPage;
  let fixture: ComponentFixture<ImageListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
