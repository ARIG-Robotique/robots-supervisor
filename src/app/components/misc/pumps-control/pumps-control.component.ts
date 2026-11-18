import { Component, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Robot } from '../../../models/Robot';
import { IOService } from '../../../services/io.service';

@Component({
    standalone: true,
    selector: 'arig-pumps-control',
    templateUrl: 'pumps-control.component.html',
    imports: [FaIconComponent],
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
