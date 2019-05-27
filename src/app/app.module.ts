import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {RobotComponent} from './views/robot/robot.component';
import {RobotsService} from './services/robots.service';
import {HomeComponent} from './views/home/home.component';
import {ServoControlComponent} from './components/servo-control/servo-control.component';
import {ServosService} from './services/servos.service';
import {MouvementInputComponent} from './components/mouvement-input/mouvement-input.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ServosComponent} from './views/servos/servos.component';
import {MouvementsComponent} from './views/mouvements/mouvements.component';
import {RobotResolve} from './resolvers/RobotResolve';
import {AppRoutes} from './app.routes';
import {RobotInfoComponent} from './views/robot-info/robot-info.component';
import {MouvementsService} from './services/mouvements.service';
import {MapComponent} from './views/map/map.component';
import {MapInputComponent} from './components/map-input/map-input.component';
import {CapteursService} from './services/capteurs.service';
import {CapteursComponent} from './views/capteurs/capteurs.component';
import {CodeursService} from './services/codeurs.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faArrowsAlt,
  faCheck,
  faCogs,
  faEdit,
  faHeartbeat,
  faInfoCircle,
  faMap,
  faMinus,
  faPlus,
  faRobot,
  faUser,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';
import {AdminComponent} from './components/admin/admin.component';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {faCopy} from '@fortawesome/free-solid-svg-icons/faCopy';
import {faDatabase} from '@fortawesome/free-solid-svg-icons/faDatabase';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActionneursComponent} from "./views/actionneurs/actionneurs.component";
import {ActionneursService} from "./services/actionneurs.service";

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    RobotComponent,
    HomeComponent,
    ServoControlComponent,
    MouvementInputComponent,
    ServosComponent,
    MouvementsComponent,
    ActionneursComponent,
    RobotInfoComponent,
    MapComponent,
    MapInputComponent,
    CapteursComponent,
    AdminComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(AppRoutes, {useHash: true}),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    RobotsService,
    ServosService,
    MouvementsService,
    RobotResolve,
    CapteursService,
    CodeursService,
    ActionneursService,
    {provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(
      faRobot,
      faInfoCircle,
      faHeartbeat,
      faCogs,
      faMap,
      faWindowClose,
      faPlus,
      faMinus,
      faArrowsAlt,
      faCheck,
      faEdit,
      faCopy,
      faDatabase,
      faUser
    );
  }
}
