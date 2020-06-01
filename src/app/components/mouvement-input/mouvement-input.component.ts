import { Component, Input } from '@angular/core';
import { Robot } from '../../models/Robot';
import { MouvementsService } from '../../services/mouvements.service';

@Component({
  selector   : 'app-mouvement-input',
  templateUrl: './mouvement-input.component.html',
  styleUrls  : ['./mouvement-input.component.scss']
})
export class MouvementInputComponent {

  @Input() robot: Robot;
  @Input() type: string;
  @Input() icon: string;
  @Input() name: string;
  @Input() fields: string[];
  @Input() select: { [K: string]: string[] };

  values: any = {};

  constructor(private mouvementsService: MouvementsService) {
  }

  apply() {
    this.mouvementsService.sendMouvement(this.robot, this.type, this.values).subscribe();
  }

}
