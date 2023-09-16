import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faCompass, faDotCircle, faFileAlt } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowLeft,
    faArrowRight,
    faArrowsAlt,
    faCalculator,
    faChartLine,
    faCheck,
    faCogs,
    faFan,
    faHeartbeat,
    faInfoCircle,
    faMap,
    faMinus,
    faPlus,
    faRedoAlt,
    faRobot,
    faRoute,
    faServer,
    faTimes,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import arrowFromTop from '../assets/icons/arrowFromTop.json';
import arrowToTop from '../assets/icons/arrowToTop.json';
import joystick from '../assets/icons/joystick.json';
import robotArm from '../assets/icons/robotArm.json';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { MapActionsComponent } from './components/map/actions/map-actions.component';
import { MapInfoComponent } from './components/map/info/map-info.component';
import { MapInputComponent } from './components/map/input/map-input.component';
import { MapPositionComponent } from './components/map/position/map-position.component';
import { MapScoreComponent } from './components/map/score/map-score.component';
import { AppNavbarComponent } from './components/misc/app-navbar/app-navbar.component';
import { AppToastsComponent } from './components/misc/app-toasts/app-toasts.component';
import { AsservInputComponent } from './components/misc/asserv-input/asserv-input.component';
import { MouvementInputComponent } from './components/misc/mouvement-input/mouvement-input.component';
import { NoRobotComponent } from './components/misc/no-robot/no-robot.component';
import { PumpsControlComponent } from './components/misc/pumps-control/pumps-control.component';
import { ServoBatchControlComponent } from './components/misc/servo-batch-control/servo-batch-control.component';
import { ServoControlComponent } from './components/misc/servo-control/servo-control.component';
import { SidebarBrasComponent } from './components/sidebars/bras/bras.component';
import { SidebarCapteursComponent } from './components/sidebars/capteurs/capteurs.component';
import { SidebarContainerComponent } from './components/sidebars/container/sidebar-container.component';
import { SidebarExecsComponent } from './components/sidebars/execs/execs.component';
import { SidebarMouvementsComponent } from './components/sidebars/mouvements/mouvements.component';
import { SidebarServosComponent } from './components/sidebars/servos/servos.component';
import { ImportLogsModalComponent } from './modals/import-logs-modal/import-logs-modal.component';
import { LogsModalComponent } from './modals/logs-modal/logs-modal.component';
import { PathsModalComponent } from './modals/paths-modal/paths-modal.component';
import { ArigExecPipe } from './pipes/exec';
import { SortPipe } from './pipes/sort';
import { ServicesMockModule } from './services/mock/services.mock-module';
import { RobotsUiService } from './services/robots-ui.service';
import { RobotsService } from './services/robots.service';
import { ServicesModule } from './services/services.module';
import { loadRobots, toggleRobot } from './store/robots.actions';
import { RobotsEffects } from './store/robots.effects';
import { robotsReducer, robotsStatusReducer, selectedRobotsReducer } from './store/robots.reducer';
import { MapComponent } from './views/map/map.component';

registerLocaleData(localeFr);

@NgModule({
    declarations: [
        // views
        AppComponent,
        MapComponent,

        // components
        AppNavbarComponent,
        AppToastsComponent,
        AsservInputComponent,
        MapInputComponent,
        MouvementInputComponent,
        NoRobotComponent,
        ServoBatchControlComponent,
        ServoControlComponent,
        SidebarBrasComponent,
        SidebarCapteursComponent,
        SidebarContainerComponent,
        SidebarExecsComponent,
        SidebarMouvementsComponent,
        SidebarServosComponent,
        MapActionsComponent,
        MapInfoComponent,
        MapPositionComponent,
        MapScoreComponent,
        PumpsControlComponent,

        // modals
        ImportLogsModalComponent,
        LogsModalComponent,
        PathsModalComponent,

        // pipes
        ArigExecPipe,
        SortPipe,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        NgbModule,
        RouterModule.forRoot(AppRoutes, { useHash: true, paramsInheritanceStrategy: 'always' }),
        StoreModule.forRoot({
            robots: robotsReducer,
            selectedRobots: selectedRobotsReducer,
            robotsStatus: robotsStatusReducer,
        }),
        EffectsModule.forRoot([RobotsEffects]),
        environment.mock ? ServicesMockModule : ServicesModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, RobotsUiService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(library: FaIconLibrary, store: Store<any>, robotsService: RobotsService) {
        library.addIcons(
            arrowFromTop as any,
            arrowToTop as any,
            joystick as any,
            robotArm as any,

            faArrowLeft,
            faArrowRight,
            faArrowsAlt,
            faCalculator,
            faChartBar,
            faChartLine,
            faCheck,
            faCogs,
            faCompass,
            faDatabase,
            faDotCircle,
            faFan,
            faFileAlt,
            faHeartbeat,
            faInfoCircle,
            faMap,
            faMinus,
            faPlus,
            faRedoAlt,
            faRobot,
            faRoute,
            faServer,
            faTimes,
            faWindowClose,
        );

        robotsService.getRobots().subscribe((robots) => {
            store.dispatch(loadRobots({ robots }));
            if (environment.mock) {
                store.dispatch(toggleRobot({ id: 1 }));
                store.dispatch(toggleRobot({ id: 2 }));
            }
        });
    }
}
