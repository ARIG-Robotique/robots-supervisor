import {Component, OnInit} from '@angular/core';
import {Robot} from "../../models/Robot";
import {RobotsService} from "../../services/robots.service";
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig] // add NgbDropdownConfig to the component providers
})
export class NavbarComponent implements OnInit {
  title = 'Robots supervisor';
  robots: Robot[];
  selectedRobot: Robot[] = [];

  constructor(config: NgbDropdownConfig,
              private robotsService: RobotsService) {
    config.placement = 'bottom-right';
    config.autoClose = false;
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

  selectRobot(event, robot: Robot) {
    if (robot.checked) {
      if (this.selectedRobot.length > 2) {
        this.selectedRobot[0].checked = false;
        this.selectedRobot.shift();
      }
      this.selectedRobot.push(robot);
    } else {
      this.selectedRobot = this.selectedRobot.filter(r => r.checked);
    }
  }

  copyLogs(robot: Robot) {
    this.robotsService.copyLogs(robot.id)
      .subscribe(() => {
        // TODO : toast notif
      });
  }

  importLogs(robot: Robot) {
    this.robotsService.importLogs(robot.id)
      .subscribe(() => {
        // tODO: toast
      });
  }

}
