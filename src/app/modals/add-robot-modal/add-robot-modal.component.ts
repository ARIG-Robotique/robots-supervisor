import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AbstractComponent } from '../../components/abstract.component';
import { Robot } from '../../models/Robot';
import { RobotsService } from '../../services/robots.service';
import { addRobot, editRobot } from '../../store/robots.actions';

@Component({
  templateUrl: './add-robot-modal.component.html'
})
export class AddRobotModalComponent extends AbstractComponent {

  robot: Robot = {
    id        : null,
    name      : '',
    host      : '',
    simulateur: false,
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
