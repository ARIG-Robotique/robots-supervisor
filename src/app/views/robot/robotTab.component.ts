import {Robot} from '../../models/Robot';
import {Subscription} from 'rxjs';
import {RobotsService} from '../../services/robots.service';
import {OnDestroy, OnInit} from '@angular/core';

export abstract class RobotTabComponent implements OnInit, OnDestroy {
  robots: Robot[];
  subs: Subscription[] = [];

  constructor(protected robotsService: RobotsService) {
  }

  protected abstract afterFetchedRobots();

  preOnInit() {
  };

  ngOnInit(): void {
    this.preOnInit();
    this.robotsService.getNotifySelectedRobotObservable()
      .subscribe((robots: Robot[]) => {
        if (robots !== null) {
          this.robots = robots;
          this.afterFetchedRobots();
        }
      });
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subs = [];
  }
}
