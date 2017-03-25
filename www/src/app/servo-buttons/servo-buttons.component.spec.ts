import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoButtonsComponent } from './servo-buttons.component';

describe('ServoButtonsComponent', () => {
  let component: ServoButtonsComponent;
  let fixture: ComponentFixture<ServoButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
