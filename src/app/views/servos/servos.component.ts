import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {Servo} from '../../models/Servo';
import {ServosService} from '../../services/servos.service';
import {RobotsService} from "../../services/robots.service";
import {RobotTabComponent} from "../robot/robotTab.component";

@Component({
  selector: 'app-servos',
  templateUrl: './servos.component.html',
  styleUrls: ['./servos.component.scss']
})
export class ServosComponent extends RobotTabComponent {

  constructor(private route: ActivatedRoute,
              protected robotsService: RobotsService,
              private servosService: ServosService) {
    super(robotsService);
  }


  fetch(robot: Robot) {
    this.servosService.getServos(robot)
      .subscribe((servos: Servo[]) => {
        robot.servos = servos;
        robot.servos.forEach(servo => {
          servo.minPosition = servo.minPosition || 500;
          servo.maxPosition = servo.maxPosition || 2500;
          servo.minSpeed = 0;
          servo.maxSpeed = 50;
        });
      });
  }

  protected afterFetchedRobots() {
    this.robots.forEach((robot: Robot) => {
      this.fetch(robot);
    });
  }

}
