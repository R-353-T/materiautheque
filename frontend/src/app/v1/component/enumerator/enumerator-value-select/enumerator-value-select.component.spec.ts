import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnumeratorValueSelectComponent } from './enumerator-value-select.component';

describe('EnumeratorValueSelectComponent', () => {
  let component: EnumeratorValueSelectComponent;
  let fixture: ComponentFixture<EnumeratorValueSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumeratorValueSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnumeratorValueSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
