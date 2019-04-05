import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {RobotTabComponent} from "../robot/robotTab.component";

@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrls: ['./robot-info.component.scss']
})
export class RobotInfoComponent extends RobotTabComponent {

  robots: Robot[];

  constructor(protected robotsService: RobotsService) {
    super(robotsService);
  }

  private getRobotInfo(robot: Robot): void {
    this.robotsService.getRobotInfo(robot)
      .subscribe((infos: any) => {
        robot.infos = infos;
      });
  }

  protected afterFetchedRobots() {
    this.robots.forEach((robot) => this.getRobotInfo(robot));
  }

}
