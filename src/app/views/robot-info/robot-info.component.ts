import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrls: ['./robot-info.component.scss']
})
export class RobotInfoComponent implements OnInit {

  robots: Robot[];

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService) {
  }

  ngOnInit() {
    this.robotsService.getNotifySelectedRobotObservable()
      .subscribe((robots: Robot[]) => {
        if (robots != null) {
          this.robots = robots;
          console.log('robot infos', this.robots);
          this.robots.forEach((robot) => this.getRobotInfo(robot));
        }
      });
  }

  private getRobotInfo(robot: Robot): void {
    this.robotsService.getRobotInfo(robot)
      .subscribe((infos: any) => {
        robot.infos = infos;
      });
  }

}
