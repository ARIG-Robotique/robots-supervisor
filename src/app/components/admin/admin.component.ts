import {Component, OnInit} from '@angular/core';
import {Robot} from "../../models/Robot";
import {RobotsService} from "../../services/robots.service";
import {Execs} from "../../models/Execs";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  robots: Robot[];
  selectedRobot: Robot;

  constructor(private robotsService: RobotsService) {
  }

  ngOnInit() {
    this.getRobots();
  }

  getRobots() {
    this.robotsService.getRobots()
      .subscribe((robots: Robot[]) => {
        this.robots = robots;
      });
  }

  deleteRobot(robot: Robot) {
    const ok = confirm('Etes-vous sûr ?');

    if (ok) {
      this.robotsService.deleteRobot(robot.id)
        .subscribe(() => this.getRobots());
    }
  }

  selectRobot(robot: Robot) {
    if (this.selectedRobot && robot.id === this.selectedRobot.id) {
      this.selectedRobot = null;
    } else {
      this.selectedRobot = robot;
      this.robotsService.getRobotFullInfo(robot.id)
        .subscribe((result: Robot) => {
          robot.execs = result.execs;
        });
    }
  }

  deleteExec(exec: Execs) {
    this.robotsService.deleteRobotExec(exec.id)
      .subscribe((result) => {
        console.log(result);
      });
  }

  addedRobot(event) {
    this.getRobots();
  }
}
