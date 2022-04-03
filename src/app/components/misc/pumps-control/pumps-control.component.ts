import { Component, Input } from '@angular/core';
import { Robot } from '../../../models/Robot';
import { IOService } from '../../../services/io.service';

@Component({
  selector   : 'arig-pumps-control',
  templateUrl: 'pumps-control.component.html',
})
export class PumpsControlComponent {

  @Input() robot: Robot;

  constructor(private ioService: IOService) {
  }

  setPumpState(pump: 'haut' | 'bas', state: boolean) {
    this.ioService.setPumpState(this.robot, pump, state).subscribe();
  }

}
