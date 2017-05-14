import {Component, OnInit, Input, DoCheck} from '@angular/core';
import {Robot} from '../models/Robot';
import {Servo} from '../models/Servo';
import {ServosService} from '../services/servos.service';

@Component({
  selector: 'app-servo-control',
  templateUrl: './servo-control.component.html',
  styleUrls: ['./servo-control.component.scss']
})
export class ServoControlComponent implements OnInit, DoCheck {

  @Input() servo: Servo;
  @Input() robot: Robot;

  previousPosition: number;
  timeoutID: any;

  constructor(private servosService: ServosService) {
  }

  ngOnInit() {
    this.previousPosition = this.servo.currentPosition;
  }

  ngDoCheck() {
    if (this.previousPosition !== this.servo.currentPosition) {
      this.previousPosition = this.servo.currentPosition;

      if (this.timeoutID) {
        window.clearTimeout(this.timeoutID);
      }
      this.timeoutID = window.setTimeout(() => {
        this.setPosition();
      }, 500);
    }
  }

  setPosition() {
    this.servosService.setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed);
  }

}
