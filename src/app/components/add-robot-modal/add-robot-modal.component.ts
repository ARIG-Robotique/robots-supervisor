import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {environment} from '../../../environments/environment';
import {Store} from '@ngrx/store';
import {AbstractComponent} from '../abstract.component';
import {addRobot, editRobot} from '../../store/robots.actions';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector   : 'app-add-robor-modal',
  templateUrl: './add-robot-modal.component.html',
  styleUrls  : ['./add-robot-modal.component.scss'],
  providers  : [RobotsService]
})
export class AddRobotModalComponent extends AbstractComponent {

  robot: Robot = {
    id        : null,
    name      : '',
    host      : '',
    simulateur: false,
    dir       : '',
    login     : '',
    pwd       : '',
  };

  constructor(private store: Store<any>,
              private modal: NgbActiveModal,
              private robotsService: RobotsService) {
    super();
  }

  addRobot() {
    if (this.robot.id) {
      this.robotsService.editRobot(this.robot)
        .subscribe((robot: Robot) => {
          this.store.dispatch(editRobot({robot}));
          this.close();
        });
    } else {
      this.robotsService.addRobot(this.robot)
        .subscribe((robot: Robot) => {
          this.store.dispatch(addRobot({robot}));
          this.close();
        });
    }
  }

  close() {
    this.modal.close();
  }
}
