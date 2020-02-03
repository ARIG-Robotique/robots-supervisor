import {Injectable} from '@angular/core';
import {RobotsService} from './robots.service';
import {ImportLogsModalComponent} from '../components/import-logs-modal/import-logs-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Robot} from '../models/Robot';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {deleteRobot} from 'app/store/robots.actions';
import {of} from 'rxjs';
import {AddRobotModalComponent} from '../components/add-robot-modal/add-robot-modal.component';
import {PathsModalComponent} from '../components/paths-modal/paths-modal.component';

@Injectable()
export class RobotsUiService {

  constructor(private robotsService: RobotsService,
              private modal: NgbModal,
              private store: Store<any>) {

  }

  importLogs(robot: Robot) {
    const modalRef = this.modal.open(ImportLogsModalComponent, {backdrop: 'static', size: 'lg'});
    modalRef.componentInstance.robot = {...robot};
  }

  deleteRobot(robot: Robot) {
    const ok = confirm('Etes-vous sûr ?');

    if (ok) {
      return this.robotsService.deleteRobot(robot.id)
        .pipe(map(() => {
          this.store.dispatch(deleteRobot({id: robot.id}));

          return true;
        }));
    } else {
      return of(false);
    }
  }

  addRobot() {
    this.modal.open(AddRobotModalComponent);
  }

  editRobot(robot: Robot) {
    const modalRef = this.modal.open(AddRobotModalComponent);
    modalRef.componentInstance.robot = {...robot};
  }

  showPaths(idRobot: number, idExec: string) {
    const modalRef = this.modal.open(PathsModalComponent);
    modalRef.componentInstance.setRobotExec(idRobot, idExec);
  }
}
