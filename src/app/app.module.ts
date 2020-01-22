import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {AddRobotModalComponent} from './components/add-robot-modal/add-robot-modal.component';
import {RouterModule} from '@angular/router';
import {RobotsService} from './services/robots.service';
import {HomeComponent} from './views/home/home.component';
import {ServoControlComponent} from './components/servo-control/servo-control.component';
import {ServosService} from './services/servos.service';
import {MouvementInputComponent} from './components/mouvement-input/mouvement-input.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ControlsComponent} from './views/controls/controls.component';
import {RobotResolve} from './resolvers/RobotResolve';
import {AppRoutes} from './app.routes';
import {MouvementsService} from './services/mouvements.service';
import {MapComponent} from './views/map/map.component';
import {MapInputComponent} from './components/map-input/map-input.component';
import {CapteursService} from './services/capteurs.service';
import {CodeursService} from './services/codeurs.service';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faCheck,
  faCogs,
  faEdit,
  faHeartbeat,
  faInfoCircle,
  faMap,
  faMinus,
  faPlus,
  faRedoAlt,
  faRobot,
  faRoute,
  faUser,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';
import {faCompass, faDotCircle} from '@fortawesome/free-regular-svg-icons';
import {AdminComponent} from './views/admin/admin.component';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {faCopy} from '@fortawesome/free-solid-svg-icons/faCopy';
import {faDatabase} from '@fortawesome/free-solid-svg-icons/faDatabase';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActionneursService} from './services/actionneurs.service';
import {Store, StoreModule} from '@ngrx/store';
import {robotsReducer} from './store/robots.reducer';
import {loadRobots} from './store/robots.actions';
import arrowFromTop from '../assets/icons/arrowFromTop.json';
import arrowToTop from '../assets/icons/arrowToTop.json';
import joystick from '../assets/icons/joystick.json';
import {ImportLogsModalComponent} from './components/import-logs-modal/import-logs-modal.component';
import {RobotsUiService} from './services/robots-ui.service';

registerLocaleData(localeFr);

@NgModule({
  declarations   : [
    AddRobotModalComponent,
    ImportLogsModalComponent,
    AdminComponent,
    AppComponent,
    ControlsComponent,
    HomeComponent,
    MapComponent,
    MapInputComponent,
    MouvementInputComponent,
    NavbarComponent,
    ServoControlComponent,
  ],
  imports        : [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(AppRoutes, {useHash: true, paramsInheritanceStrategy: 'always'}),
    StoreModule.forRoot({robots: robotsReducer}),
    NgbModule,
    ToastrModule.forRoot(),
  ],
  providers      : [
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    ActionneursService,
    CapteursService,
    CodeursService,
    MouvementsService,
    RobotResolve,
    RobotsService,
    ServosService,
    RobotsUiService,
  ],
  bootstrap      : [AppComponent],
  entryComponents: [AddRobotModalComponent, ImportLogsModalComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary,
              store: Store<any>,
              robotsService: RobotsService) {
    library.addIcons(
      arrowToTop as any,
      arrowFromTop as any,
      joystick as any,
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
      faUser,
      faRoute,
      faDotCircle,
      faArrowLeft,
      faArrowRight,
      faCompass,
      faRedoAlt
    );

    robotsService.getRobots()
      .subscribe(robots => store.dispatch(loadRobots({robots})));
  }
}
