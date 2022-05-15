import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ImportLogsModalComponent } from '../modals/import-logs-modal/import-logs-modal.component';
import { LogsModalComponent } from '../modals/logs-modal/logs-modal.component';
import { PathsModalComponent } from '../modals/paths-modal/paths-modal.component';
import { Exec } from '../models/Exec';
import { Robot } from '../models/Robot';
import { RobotsService } from './robots.service';

@Injectable()
export class RobotsUiService {

  constructor(private robotsService: RobotsService,
              private modal: NgbModal) {

  }

  importLogs(robot: Robot): Observable<any> {
    const modalRef = this.modal.open(ImportLogsModalComponent, {backdrop: 'static', size: 'lg'});
    (modalRef.componentInstance as ImportLogsModalComponent).robot = {...robot};
    return modalRef.closed;
  }

  showPaths(idRobot: number, exec: Exec) {
    const modalRef = this.modal.open(PathsModalComponent, {size: 'lg'});
    (modalRef.componentInstance as PathsModalComponent).setRobotExec(idRobot, exec);
  }

  showLogs(idRobot: number, exec: Exec) {
    const modalRef = this.modal.open(LogsModalComponent, {size: 'xl', fullscreen:true});
    (modalRef.componentInstance as LogsModalComponent).setRobotExec(idRobot, exec);
  }
}
