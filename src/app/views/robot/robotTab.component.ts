import {Robot} from "../../models/Robot";
import {Subscription} from "rxjs";
import {RobotsService} from "../../services/robots.service";
import {OnInit} from "@angular/core";

export abstract class RobotTabComponent implements OnInit {
  robots: Robot[];
  subs: Subscription[] = [];

  constructor(protected robotsService: RobotsService) {
  }

  protected abstract afterFetchedRobots();

  ngOnInit(): void {
    this.robotsService.getNotifySelectedRobotObservable()
      .subscribe((robots: Robot[]) => {
        if (robots !== null) {
          this.robots = robots;
          this.afterFetchedRobots();
        }
      });
  }
}
