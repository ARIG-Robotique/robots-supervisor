import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'arig-app',
    templateUrl: './app.component.html',
})
export class AppComponent {
    @HostBinding('class')
    cssClass = 'd-flex flex-column';
}
