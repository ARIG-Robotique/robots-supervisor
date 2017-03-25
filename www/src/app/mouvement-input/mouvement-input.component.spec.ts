import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementInputComponent } from './mouvement-input.component';

describe('MouvementInputComponent', () => {
  let component: MouvementInputComponent;
  let fixture: ComponentFixture<MouvementInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouvementInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
