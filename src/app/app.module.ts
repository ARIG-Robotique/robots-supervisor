import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {AddRobotModalComponent} from './components/add-robot-modal/add-robot-modal.component';
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
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {
  faArrowLeft,
  faArrowsAlt,
  faArrowRight,
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
import {ActionneursComponent} from './views/actionneurs/actionneurs.component';
import {ActionneursService} from './services/actionneurs.service';
import {Store, StoreModule} from '@ngrx/store';
import {robotsReducer} from './store/robots.reducer';
import {loadRobots} from './store/robots.actions';

registerLocaleData(localeFr);

@NgModule({
  declarations   : [
    ActionneursComponent,
    AdminComponent,
    AppComponent,
    CapteursComponent,
    HomeComponent,
    MapComponent,
    MapInputComponent,
    MouvementInputComponent,
    MouvementsComponent,
    NavbarComponent,
    RobotComponent,
    RobotInfoComponent,
    ServoControlComponent,
    ServosComponent,
    AddRobotModalComponent,
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
  ],
  bootstrap      : [AppComponent],
  entryComponents: [AddRobotModalComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary,
              store: Store<any>,
              robotsService: RobotsService) {
    const arrowToTop = {
      prefix  : 'fac',
      iconName: 'arrow-to-top',
      icon    : [
        384, 512, [], '',
        'M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm66.4 280.5l65.6-65.6V456c0 13.3 10.7 24 24 24h24c13.3 0 24-10.7 24-24V246.9l65.6 65.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L209 126.1c-9.4-9.4-24.6-9.4-33.9 0L39.5 261.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0z'
      ]
    };

    const arrowFromTop = {
      prefix  : 'fac',
      iconName: 'arrow-from-top',
      icon    : [
        384, 512, [], '',
        'M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm269.6 263.5L228 361.1V152c0-13.3-10.7-24-24-24h-24c-13.3 0-24 10.7-24 24v209.1l-65.6-65.6c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L175 481.9c9.4 9.4 24.6 9.4 33.9 0l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.3-9.4-24.5-9.4-33.8 0z'
      ]
    };

    library.addIcons(
      arrowToTop as any,
      arrowFromTop as any,
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
