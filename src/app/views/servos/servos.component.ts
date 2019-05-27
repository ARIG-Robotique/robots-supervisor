import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {Servo, ServoGroup, ServoPair, ServoPairResponse, ServoResponse} from '../../models/Servo';
import {ServosService} from '../../services/servos.service';
import {RobotsService} from '../../services/robots.service';
import {RobotTabComponent} from '../robot/robotTab.component';

@Component({
  selector: 'app-servos',
  templateUrl: './servos.component.html',
  styleUrls: ['./servos.component.scss']
})
export class ServosComponent extends RobotTabComponent {

  servosGroups: ServoGroup[];

  constructor(private route: ActivatedRoute,
              protected robotsService: RobotsService,
              private servosService: ServosService) {
    super(robotsService);
  }

  fetch(robot: Robot) {
    this.servosService.getServos(robot)
      .subscribe((servosResponse: ServoResponse) => {
        const servos: Servo[] = [];
        this.servosGroups = [];
        Object.keys(servosResponse)
          .forEach(key => {

            const servoGroup: {
              name: string,
              servos: ServoPair[]
            } = {
              name: '',
              servos: []
            };

            servoGroup.name = key;

            this.servosGroups.push(servoGroup);

            const servoPairs: ServoPairResponse[] = servosResponse[key];

            servoPairs.forEach((pair: ServoPairResponse) => {
              const right = this.complteServo(pair.value);
              const left = this.complteServo(pair.key);

              const servoPair: {
                left: Servo,
                right: Servo,
              } = {
                left: left,
                right: right
              };

              servoGroup.servos.push(servoPair);

              servos.push(left);
              servos.push(right);
            });
          });

        robot.servos = servos;
      });
  }

  private complteServo(servo: Servo): Servo {
    servo.minPosition = servo.minPosition || 500;
    servo.maxPosition = servo.maxPosition || 2500;
    servo.minSpeed = 0;
    servo.maxSpeed = 50;
    return servo;
  }

  protected afterFetchedRobots() {
    this.robots.forEach((robot: Robot) => {
      this.fetch(robot);
    });
  }

}
