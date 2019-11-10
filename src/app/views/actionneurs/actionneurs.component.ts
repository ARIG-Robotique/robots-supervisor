import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RobotsService} from '../../services/robots.service';
import {ActionneursService} from '../../services/actionneurs.service';
import {ESide} from '../../models/ESide';
import {EActionneurState} from '../../models/EActionneurState';
import {RobotTabComponent} from '../robot/robotTab.component';

@Component({
  selector   : 'app-robot-actionneurs',
  templateUrl: './actionneurs.component.html',
  styleUrls  : ['./actionneurs.component.scss']
})
export class ActionneursComponent extends RobotTabComponent {

  ESide = ESide;
  EActionneurState = EActionneurState;

  constructor(route: ActivatedRoute,
              private robotsService: RobotsService,
              private actionneursService: ActionneursService) {
    super(route);
  }

  setEv(side: ESide, state: EActionneurState) {
    this.actionneursService.ev(this.robot, side, state)
      .subscribe();
  }

  setPompe(side: ESide, state: EActionneurState) {
    this.actionneursService.pompe(this.robot, side, state)
      .subscribe();
  }

}
