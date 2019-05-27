import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {ActionneursService} from "../../services/actionneurs.service";
import {ESide} from "../../models/ESide";
import {EActionneurState} from "../../models/EActionneurState";

@Component({
  selector: 'app-robot-actionneurs',
  templateUrl: './actionneurs.component.html',
  styleUrls: ['./actionneurs.component.scss']
})
export class ActionneursComponent implements OnInit {

  robots: Robot[];

  ESide = ESide;
  EActionneurState = EActionneurState;

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService,
              private actionneursService: ActionneursService) {
  }

  ngOnInit() {
    this.robotsService.getNotifySelectedRobotObservable()
      .subscribe((robots: Robot[]) => {
        if (robots !== null) {
          this.robots = robots;
        }
      });
  }

  setEv(robot: Robot, side: ESide, state: EActionneurState) {
    this.actionneursService.ev(robot, side, state)
      .subscribe();
  }

  setPompe(robot: Robot, side: ESide, state: EActionneurState) {
    this.actionneursService.pompe(robot, side, state)
      .subscribe();
  }

}
