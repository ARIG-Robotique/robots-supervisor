import {Component, OnInit, Input} from '@angular/core';
import {Robot} from '../../models/Robot';
import {MouvementsService} from '../../services/mouvements.service';

@Component({
  selector: 'app-mouvement-input',
  templateUrl: './mouvement-input.component.html',
  styleUrls: ['./mouvement-input.component.scss']
})
export class MouvementInputComponent implements OnInit {

  @Input() robot: Robot;
  @Input() type: string;
  @Input() fields: string[];

  values: any;

  constructor(private mouvementsService: MouvementsService) {
    this.values = {};
  }

  ngOnInit() {
  }

  apply() {
    this.mouvementsService.sendMouvement(this.robot, this.type, this.values).subscribe(() => {});
  }

}
