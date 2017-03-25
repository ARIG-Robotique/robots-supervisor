import {Component, OnInit, Input} from '@angular/core';
import {Robot} from "../models/robot";
import {ServosService} from "../servos.service";

@Component({
  selector: 'app-mouvement-input',
  templateUrl: './mouvement-input.component.html',
  styleUrls: ['./mouvement-input.component.scss']
})
export class MouvementInputComponent implements OnInit {

  @Input() robot:Robot;
  @Input() type:string;
  @Input() fields:string[];

  values:any;

  constructor(private servosService:ServosService) {
    this.values = {};
  }

  ngOnInit() {
  }

  apply() {
    this.servosService.sendMouvement(this.robot, this.type, this.values);
  }

}
