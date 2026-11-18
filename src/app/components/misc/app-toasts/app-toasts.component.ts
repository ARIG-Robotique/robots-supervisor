import { Component } from '@angular/core';
import { AppToastService } from 'app/services/toast.service';
import { NgFor } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
    selector: 'arig-app-toasts',
    templateUrl: 'app-toasts.component.html',
    styleUrls: ['app-toasts.component.scss'],
    imports: [NgFor, NgbToast],
})
export class AppToastsComponent {
    constructor(public toastService: AppToastService) {}
}
