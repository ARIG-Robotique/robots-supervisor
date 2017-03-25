import {Component, OnInit} from "@angular/core";
import {RobotsService} from "../robots.service";
import {ActivatedRoute, Params} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {Servo} from "../models/Servo";
import {Robot} from "../models/robot";
import {Mouvements} from "../constants/mouvements.constants";

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent implements OnInit {

  private robot:Robot;

  private servos:Servo[];

  private MOUVEMENTS;

  constructor(private route:ActivatedRoute,
              private robotsService:RobotsService) {
    this.MOUVEMENTS = Mouvements;
  }

  ngOnInit() {
    this.route.params
      .switchMap((params:Params) => this.robotsService.getRobot(params['id']))
      .subscribe((robot: Robot) => {
        this.robot = robot;

        this.robotsService.getRobotServos(this.robot)
          .then((servos:Servo[]) => {
            this.servos = servos;
          });
      });
  }

  refresh() {
    alert('TODO');
  }

}
