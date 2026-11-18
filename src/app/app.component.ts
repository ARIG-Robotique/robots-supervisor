import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNavbarComponent } from './components/misc/app-navbar/app-navbar.component';
import { AppToastsComponent } from './components/misc/app-toasts/app-toasts.component';

@Component({
    standalone: true,
    selector: 'arig-app',
    templateUrl: './app.component.html',
    imports: [AppToastsComponent, AppNavbarComponent, RouterOutlet],
})
export class AppComponent {
    @HostBinding('class')
    cssClass = 'd-flex flex-column';
}
