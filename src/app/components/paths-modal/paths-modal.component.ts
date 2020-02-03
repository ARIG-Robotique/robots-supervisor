import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component} from '@angular/core';
import {ExecsService} from '../../services/execs.service';

@Component({
  templateUrl: 'paths-modal.component.html',
  styleUrls  : ['paths-modal.component.scss'],
})
export class PathsModalComponent {

  idRobot: number;
  idExec: string;
  paths: string[];

  currentIdx = 0;

  constructor(private modal: NgbActiveModal,
              private execsService: ExecsService) {
  }

  setRobotExec(idRobot: number, idExec: string): void {
    this.idRobot = idRobot;
    this.idExec = idExec;
    this.execsService.getPaths(this.idRobot, this.idExec)
      .subscribe(paths => this.paths = paths);
  }

  getPathFile(file: string): string {
    return this.execsService.getPathFile(this.idRobot, this.idExec, file);
  }

  close() {
    this.modal.close();
  }

  onSlide(id: string) {
    this.currentIdx = +id.slice(6);
  }

}
