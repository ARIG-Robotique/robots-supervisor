import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faCompass, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faCalculator,
  faChartLine,
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
  faServer,
  faUser,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import arrowFromTop from '../assets/icons/arrowFromTop.json';
import arrowToTop from '../assets/icons/arrowToTop.json';
import joystick from '../assets/icons/joystick.json';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { AddRobotModalComponent } from './components/add-robot-modal/add-robot-modal.component';
import { CapteursComponent } from './components/capteurs/capteurs.component';
import { ImportLogsModalComponent } from './components/import-logs-modal/import-logs-modal.component';
import { MapInputComponent } from './components/map-input/map-input.component';
import { MouvementInputComponent } from './components/mouvement-input/mouvement-input.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PathsModalComponent } from './components/paths-modal/paths-modal.component';
import { AsservInputComponent } from './components/asserv-input/asserv-input.component';
import { PointsCalculatorModalComponent } from './components/points-calculator-modal/points-calculator-modal.component';
import { ServoBatchControlComponent } from './components/servo-batch-control/servo-batch-control.component';
import { ServoControlComponent } from './components/servo-control/servo-control.component';
import { RobotResolve } from './resolvers/RobotResolve';
import { AsservissementService } from './services/asservissement.service';
import { CapteursService } from './services/capteurs.service';
import { CodeursService } from './services/codeurs.service';
import { ExecsService } from './services/execs.service';
import { MouvementsService } from './services/mouvements.service';
import { RobotsUiService } from './services/robots-ui.service';
import { RobotsService } from './services/robots.service';
import { ServosService } from './services/servos.service';
import { loadRobots } from './store/robots.actions';
import { robotsReducer } from './store/robots.reducer';
import { AdminComponent } from './views/admin/admin.component';
import { ControlsComponent } from './views/controls/controls.component';
import { HomeComponent } from './views/home/home.component';
import { MapComponent } from './views/map/map.component';

registerLocaleData(localeFr);

@NgModule({
  declarations   : [
    AddRobotModalComponent,
    AdminComponent,
    AppComponent,
    AsservInputComponent,
    CapteursComponent,
    ControlsComponent,
    HomeComponent,
    ImportLogsModalComponent,
    MapComponent,
    MapInputComponent,
    MouvementInputComponent,
    NavbarComponent,
    PathsModalComponent,
    PointsCalculatorModalComponent,
    ServoBatchControlComponent,
    ServoControlComponent,
  ],
  imports        : [
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, {useHash: true, paramsInheritanceStrategy: 'always'}),
    StoreModule.forRoot({robots: robotsReducer}),
    ToastrModule.forRoot(),
  ],
  providers      : [
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    AsservissementService,
    CapteursService,
    CodeursService,
    ExecsService,
    MouvementsService,
    RobotResolve,
    RobotsService,
    RobotsUiService,
    ServosService,
  ],
  bootstrap      : [AppComponent],
  entryComponents: [
    AddRobotModalComponent,
    ImportLogsModalComponent,
    PathsModalComponent,
    PointsCalculatorModalComponent,
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary,
              store: Store<any>,
              robotsService: RobotsService) {
    library.addIcons(
      arrowToTop as any,
      arrowFromTop as any,
      joystick as any,
      faArrowLeft,
      faArrowRight,
      faArrowsAlt,
      faCalculator,
      faChartBar,
      faChartLine,
      faCheck,
      faCogs,
      faCompass,
      faCopy,
      faDatabase,
      faDotCircle,
      faEdit,
      faHeartbeat,
      faInfoCircle,
      faMap,
      faMinus,
      faPlus,
      faRedoAlt,
      faRobot,
      faRoute,
      faServer,
      faUser,
      faWindowClose
    );

    robotsService.getRobots()
      .subscribe(robots => store.dispatch(loadRobots({robots})));
  }
}
