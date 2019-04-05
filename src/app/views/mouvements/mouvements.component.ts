import {Component, OnInit} from '@angular/core';
import {Mouvements} from '../../constants/mouvements.constants';
import {RobotTabComponent} from "../robot/robotTab.component";
import {RobotsService} from "../../services/robots.service";

@Component({
  selector: 'app-mouvements',
  templateUrl: './mouvements.component.html',
  styleUrls: ['./mouvements.component.scss']
})
export class MouvementsComponent extends RobotTabComponent {

  constructor(protected robotsService: RobotsService) {
    super(robotsService);
  }

  protected afterFetchedRobots() {
    this.robots.forEach(robot => {
      robot.mouvements = Mouvements;
    })
  }

}
