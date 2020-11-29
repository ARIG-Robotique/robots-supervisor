import { Component, Input } from '@angular/core';
import { Robot } from '../../models/Robot';
import { ServoConfig, ServoPosition } from '../../models/Servo';
import { ServosService } from '../../services/servos.service';

@Component({
  selector   : 'arig-servo-control',
  templateUrl: './servo-control.component.html',
  styleUrls  : ['./servo-control.component.scss']
})
export class ServoControlComponent {

  @Input() servo: ServoConfig;
  @Input() robot: Robot;

  trackByName = (i: number, item: ServoPosition) => item.name;

  constructor(private servosService: ServosService) {
  }

  setPosition() {
    this.servosService.setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed).subscribe();
  }

  incrementPosition(value: number) {
    this.servo.currentPosition = this.servo.currentPosition + value;
    this.setPosition();
  }

}
