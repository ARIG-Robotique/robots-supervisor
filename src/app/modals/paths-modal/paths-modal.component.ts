import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Exec } from '../../models/Exec';
import { ExecsService } from '../../services/execs.service';

@Component({
    templateUrl: 'paths-modal.component.html',
    styleUrls: ['paths-modal.component.scss'],
})
export class PathsModalComponent {
    idRobot: number;
    exec: Exec;
    paths: string[];

    currentIdx = 0;

    constructor(
        private modal: NgbActiveModal,
        private execsService: ExecsService,
    ) {}

    setRobotExec(idRobot: number, exec: Exec): void {
        this.idRobot = idRobot;
        this.exec = exec;
        this.execsService.getPaths(idRobot, exec.id).subscribe((paths) => (this.paths = paths));
    }

    getPathFile(file: string): string {
        return this.execsService.getPathFile(this.idRobot, this.exec.id, file);
    }

    close() {
        this.modal.close();
    }

    onSlide(id: string) {
        this.currentIdx = +id.slice(6);
    }
}
