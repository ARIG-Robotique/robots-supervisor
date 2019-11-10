import {Component} from '@angular/core';
import {RobotTabComponent} from '../robot/robotTab.component';
import {ActivatedRoute} from '@angular/router';
import {Mouvements} from '../../constants/mouvements.constants';

@Component({
  selector   : 'app-mouvements',
  templateUrl: './mouvements.component.html',
  styleUrls  : ['./mouvements.component.scss']
})
export class MouvementsComponent extends RobotTabComponent {

  Mouvements = Mouvements;

  constructor(route: ActivatedRoute) {
    super(route);
  }

}
