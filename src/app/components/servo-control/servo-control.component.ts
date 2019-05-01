import {Component, Input, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {Servo} from '../../models/Servo';
import {ServosService} from '../../services/servos.service';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-servo-control',
  templateUrl: './servo-control.component.html',
  styleUrls: ['./servo-control.component.scss']
})
export class ServoControlComponent implements OnInit {

  @Input() servo: Servo;
  @Input() robot: Robot;

  position = new FormControl(1500, {
    updateOn: 'blur'
  });

  constructor(private servosService: ServosService) {
  }

  ngOnInit() {
    this.position.setValue(this.servo.currentPosition, {emitEvent: false});

    this.position.valueChanges
      .subscribe((position) => {
        this.setPosition(position);
      });
  }

  setPosition(position: number) {
    this.position.setValue(position, {emitEvent: false});
    this.servosService.setPosition(this.robot, this.servo, position, this.servo.currentSpeed)
      .subscribe();
  }

  incrementPosition(value: number) {
    this.setPosition(this.position.value + value);
  }

}
