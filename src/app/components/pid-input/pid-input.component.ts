import {Component, Input, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {AsservissementService} from '../../services/asservissement.service';
import {Pid} from '../../models/Pid';

@Component({
  selector   : 'app-pid-input',
  templateUrl: './pid-input.component.html',
  styleUrls  : ['../mouvement-input/mouvement-input.component.scss'],
})
export class PidInputComponent implements OnInit {

  @Input() type: 'ANGLE' | 'DIST';
  @Input() robot: Robot;

  values: Pid = {kp: 0, ki: 0, kd: 0};

  constructor(private asservissement: AsservissementService) {

  }

  ngOnInit() {
    this.asservissement.getPid(this.robot, this.type)
      .subscribe(pid => this.values = pid);
  }

  apply() {
    this.asservissement.setPid(this.robot, this.type, this.values).subscribe();
  }

}
