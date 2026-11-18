import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Robot } from '../../../models/Robot';
import { ServoGroup } from '../../../models/Servo';
import { ServosService } from '../../../services/servos.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'arig-servo-batch-control',
    templateUrl: './servo-batch-control.component.html',
    imports: [NgFor],
})
export class ServoBatchControlComponent {
    @Input() group: ServoGroup;
    @Input() robot: Robot;
    @Output() changePosition = new EventEmitter<void>();

    trackByIndex = (i: number, item: any) => i;

    constructor(private servosService: ServosService) {}

    setPosition(position: string) {
        this.servosService
            .setPositionBatch(this.robot, this.group, position)
            .subscribe(() => this.changePosition.emit());
    }
}
