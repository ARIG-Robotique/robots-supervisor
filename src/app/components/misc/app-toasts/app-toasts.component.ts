import { Component } from "@angular/core";
import { AppToastService } from "app/services/toast.service";

@Component({
    selector   : 'arig-app-toasts',
    templateUrl: 'app-toasts.component.html',
    styleUrls  : ['app-toasts.component.scss'],
})
export class AppToastsComponent {
    constructor(public toastService: AppToastService) {}
}
