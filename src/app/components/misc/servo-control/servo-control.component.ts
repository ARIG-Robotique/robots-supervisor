import { Component, Input } from '@angular/core';
import { Robot } from '../../../models/Robot';
import { Servo, ServoPosition } from '../../../models/Servo';
import { ServosService } from '../../../services/servos.service';

@Component({
    selector: 'arig-servo-control',
    templateUrl: './servo-control.component.html',
})
export class ServoControlComponent {
    @Input() servo: Servo;
    @Input() robot: Robot;

    trackByName = (i: number, item: ServoPosition) => item.name;

    get positions() {
        return Object.values(this.servo.positions);
    }

    constructor(private servosService: ServosService) {}

    setPosition() {
        this.servosService
            .setPosition(this.robot, this.servo, this.servo.currentPosition, this.servo.currentSpeed)
            .subscribe();
    }

    setPositionByName() {
        const position = this.positions.find((p) => p.value === this.servo.currentPosition);
        this.servo.currentSpeed = position.speed;
        this.setPosition();
    }

    incrementPosition(value: number) {
        this.servo.currentPosition += value;
        this.setPosition();
    }
}
