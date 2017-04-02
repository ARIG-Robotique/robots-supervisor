import {Component, OnInit} from "@angular/core";
import {Robot} from "../models/Robot";
import {RobotsService} from "../services/robots.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [RobotsService]
})
export class SidebarComponent implements OnInit {

  robots:Robot[];

  newRobot:Robot = <Robot>{};

  constructor(private robotsService:RobotsService) {
  }

  ngOnInit() {
    this.getRobots();
  }

  getRobots() {
    this.robotsService.getRobots()
      .then((robots:Robot[]) => {
        this.robots = robots;
      });
  }

  addRobot() {
    this.robotsService.addRobot(this.newRobot)
      .then(() => {
        this.getRobots();
        this.newRobot = <Robot>{};
      });
  }

  selectRobot(robot:Robot) {
    this.robotsService.getRobotInfo(robot)
      .then((info) => {
        console.log(info);
      });
  }

}
