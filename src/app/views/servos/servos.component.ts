import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {Servo} from '../../models/Servo';
import {ServosService} from '../../services/servos.service';

@Component({
  selector: 'app-servos',
  templateUrl: './servos.component.html',
  styleUrls: ['./servos.component.scss']
})
export class ServosComponent implements OnInit {

  robot: Robot;

  servos: Servo[];

  constructor(private route: ActivatedRoute,
              private servosService: ServosService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];
      this.servos = [];

      this.fetch();
    });
  }

  fetch() {
    this.servosService.getServos(this.robot)
      .subscribe((servos: Servo[]) => {
        this.servos = servos;
        this.servos.forEach(servo => {
          servo.minPosition = servo.minPosition || 500;
          servo.maxPosition = servo.maxPosition || 2500;
          servo.minSpeed = 0;
          servo.maxSpeed = 50;
        });
      });
  }

}
