import {Component, Input, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {Servo} from '../../models/Servo';
import {ServosService} from '../../services/servos.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-servo-control',
  templateUrl: './servo-control.component.html',
  styleUrls: ['./servo-control.component.scss']
})
export class ServoControlComponent {

  @Input() servo: Servo;
  @Input() robot: Robot;

  constructor(private servosService: ServosService) {
  }

  setPosition() {
    let ok = true;
    if (this.servo.currentPosition < this.servo.minPosition || this.servo.currentPosition > this.servo.maxPosition) {
      ok = confirm(`La position est en dehors de la plage [${this.servo.minPosition}, ${this.servo.maxPosition}]. Continuer ?`);
    }

    if (ok) {
      this.servosService.setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed).subscribe();
    } else {
      this.servo.currentPosition = Math.max(this.servo.minPosition, Math.min(this.servo.maxPosition, this.servo.currentPosition));
    }
  }

  incrementPosition(value: number) {
    this.servo.currentPosition = this.servo.currentPosition + value;
    this.setPosition();
  }

}
