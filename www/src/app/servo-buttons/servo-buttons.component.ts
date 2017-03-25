import {Component, OnInit, Input} from "@angular/core";
import {ServosService} from "../servos.service";
import {Robot} from "../models/robot";
import {Servo} from "../models/Servo";

@Component({
  selector: 'app-servo-buttons',
  templateUrl: './servo-buttons.component.html',
  styleUrls: ['./servo-buttons.component.scss']
})
export class ServoButtonsComponent implements OnInit {

  @Input() servo:Servo;
  @Input() robot:Robot;

  constructor(private servosService:ServosService) { }

  ngOnInit() {
  }

  setPosition(position: number) {
    this.servo.currentPosition = position;
    this.servosService.setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed);
  }

}
