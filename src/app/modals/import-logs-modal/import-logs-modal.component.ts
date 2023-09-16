import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppToastService } from 'app/services/toast.service';
import { environment } from '../../../environments/environment';
import { httpurl } from '../../constants/httpurl.constants';
import { Robot } from '../../models/Robot';

@Component({
    templateUrl: './import-logs-modal.component.html',
})
export class ImportLogsModalComponent implements OnInit {
    @Input()
    robot: Robot;

    logs = '';
    done = false;

    private ws: WebSocket;

    @ViewChild('logsOutput')
    private logoutput: ElementRef<HTMLTextAreaElement>;

    constructor(
        private modal: NgbActiveModal,
        private toastService: AppToastService,
    ) {}

    close() {
        this.ws.close();
        this.modal.close();
    }

    ngOnInit(): void {
        this.ws = new WebSocket(environment.wsServer + httpurl.ws);

        this.ws.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.action === 'log') {
                const item = data.data;
                this.logs += `[${item.level.toUpperCase()}] ${item.time} - ${item.message}\n`;

                setTimeout(() => this.logoutput.nativeElement.scrollTo(0, this.logoutput.nativeElement.scrollHeight));
            } else if (data.action === 'importLogsDone') {
                this.toastService.success('Tous les logs importés');
                this.close();
            } else if (data.action === 'importLogsError') {
                this.done = true;
                this.toastService.error(`Erreur d'import`);
            }
        };

        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({ action: 'importLogs', data: { idRobot: this.robot.id } }));
        };

        this.ws.onerror = () => {
            this.toastService.error('Erreur WebSocket');
            this.modal.close();
        };
    }
}
