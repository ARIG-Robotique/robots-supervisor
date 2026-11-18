import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Exec } from '../../models/Exec';
import { Log } from '../../models/Log';
import { ExecsService } from '../../services/execs.service';
import { NgFor, AsyncPipe } from '@angular/common';
import { ArigExecPipe } from '../../pipes/exec';

@Component({
    templateUrl: 'logs-modal.component.html',
    styleUrls: ['logs-modal.component.scss'],
    imports: [NgFor, AsyncPipe, ArigExecPipe],
})
export class LogsModalComponent {
    idRobot: number;
    exec: Exec;
    logs$: Observable<Log[]>;

    constructor(
        private modal: NgbActiveModal,
        private execsService: ExecsService,
    ) {}

    setRobotExec(idRobot: number, exec: Exec): void {
        this.idRobot = idRobot;
        this.exec = exec;
        this.logs$ = this.execsService.getLogs(idRobot, exec.id);
    }

    close() {
        this.modal.close();
    }

    shortClassName(clazz: string) {
        return clazz.replace(/([^.]+)\./g, (match, part) => {
            return part[0] + '.';
        });
    }
}
