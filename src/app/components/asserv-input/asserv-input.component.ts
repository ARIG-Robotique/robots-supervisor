import { Component, Input, OnInit } from '@angular/core';
import { Asserv } from '../../models/Asserv';
import { Robot } from '../../models/Robot';
import { AsservissementService } from '../../services/asservissement.service';

@Component({
  selector   : 'app-asserv-input',
  templateUrl: './asserv-input.component.html',
  styleUrls  : ['../mouvement-input/mouvement-input.component.scss'],
})
export class AsservInputComponent implements OnInit {

  @Input() type: 'ANGLE' | 'DIST';
  @Input() robot: Robot;

  values: Asserv = {kp: 0, ki: 0, kd: 0, rampAcc: 0, rampDec: 0, vitesse: 0};

  constructor(private asservissement: AsservissementService) {

  }

  ngOnInit() {
    this.asservissement.getValues(this.robot, this.type)
      .subscribe(values => this.values = values);
  }

  apply() {
    this.asservissement.setValues(this.robot, this.type, this.values).subscribe();
  }

}
