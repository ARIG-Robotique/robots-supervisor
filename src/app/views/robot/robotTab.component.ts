import {Robot} from '../../models/Robot';
import {ActivatedRoute} from '@angular/router';
import {AbstractComponent} from '../../components/abstract.component';

export abstract class RobotTabComponent extends  AbstractComponent {

  robot: Robot;

  constructor(private route: ActivatedRoute) {
    super();
    this.robot = this.route.snapshot.data['robot'];
  }

}
