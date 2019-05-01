import {Component, OnDestroy, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {Execs} from '../../models/Execs';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  robots: Robot[];
  selectedRobot: Robot;

  robotsSubscription: Subscription;

  constructor(private robotsService: RobotsService) {
  }

  ngOnInit() {
    this.getRobots();
  }

  getRobots() {
    this.robotsSubscription = this.robotsService.getRobotObservable()
      .subscribe((robots: Robot[]) => {
        this.robots = robots;
      });
  }

  deleteRobot(robot: Robot) {
    const ok = confirm('Etes-vous sûr ?');

    if (ok) {
      this.robotsService.deleteRobot(robot.id)
        .subscribe(() => this.robotsService.getRobots());
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
    this.robotsService.getRobots();
  }

  ngOnDestroy(): void {
    if (this.robotsSubscription) {
      this.robotsSubscription.unsubscribe();
      this.robotsSubscription = null;
    }
  }
}
