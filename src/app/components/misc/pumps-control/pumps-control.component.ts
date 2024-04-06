import { Component, Input } from '@angular/core';
import { Robot } from '../../../models/Robot';
import { IOService } from '../../../services/io.service';

@Component({
    selector: 'arig-pumps-control',
    templateUrl: 'pumps-control.component.html',
})
export class PumpsControlComponent {
    @Input() robot: Robot;

    constructor(private ioService: IOService) {}

    setElectroAimant(state: 'on' | 'off') {
        this.ioService.setElectroAimant(this.robot, state).subscribe();
    }

    setSolarWheel(state: 'jaune' | 'bleu' | 'off') {
        this.ioService.setSolarWheel(this.robot, state).subscribe();
    }
}
