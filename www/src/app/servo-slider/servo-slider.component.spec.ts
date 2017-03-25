import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoSliderComponent } from './servo-slider.component';

describe('ServoSliderComponent', () => {
  let component: ServoSliderComponent;
  let fixture: ComponentFixture<ServoSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
