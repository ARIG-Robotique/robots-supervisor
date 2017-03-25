import {Component, OnInit, Input, DoCheck} from "@angular/core";
import {Servo} from "../models/Servo";
import {Robot} from "../models/robot";
import {ServosService} from "../servos.service";

@Component({
  selector: 'app-servo-slider',
  templateUrl: './servo-slider.component.html',
  styleUrls: ['./servo-slider.component.scss']
})
export class ServoSliderComponent implements OnInit, DoCheck {

  @Input() servo:Servo;
  @Input() robot:Robot;

  previousPosition:number;
  timeoutID:any;

  constructor(private servosService:ServosService) {
  }

  ngOnInit() {
    this.previousPosition = this.servo.currentPosition;
  }

  ngDoCheck() {
    if (this.previousPosition !== this.servo.currentPosition) {
      this.previousPosition = this.servo.currentPosition;

      if (this.timeoutID) window.clearTimeout(this.timeoutID);
      this.timeoutID = window.setTimeout(() => {
        this.setPosition();
      }, 500);
    }
  }

  setPosition() {
    this.servosService.setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed);
  }

}
