import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, inject, LOCALE_ID, importProvidersFrom, provideAppInitializer } from '@angular/core';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';
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
    faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import arrowFromTop from '../assets/icons/arrowFromTop.json';
import arrowToTop from '../assets/icons/arrowToTop.json';
import joystick from '../assets/icons/joystick.json';
import robotArm from '../assets/icons/robotArm.json';
import { environment } from '../environments/environment';
import { AppRoutes } from './app.routes';
import { servicesMockProviders } from './services/mock/services.mock-providers';
import { RobotsService } from './services/robots.service';
import { servicesProviders } from './services/services.providers';
import { loadRobots, toggleRobot } from './store/robots.actions';
import { RobotsEffects } from './store/robots.effects';
import { robotsReducer, robotsStatusReducer, selectedRobotsReducer } from './store/robots.reducer';

registerLocaleData(localeFr);

function initializeApp(): void {
    const library = inject(FaIconLibrary);
    const store = inject(Store);
    const robotsService = inject(RobotsService);

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
        }
    });
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideRouter(AppRoutes, withHashLocation(), withRouterConfig({ paramsInheritanceStrategy: 'always' })),
        provideStore({
            robots: robotsReducer,
            selectedRobots: selectedRobotsReducer,
            robotsStatus: robotsStatusReducer,
        }),
        provideEffects([RobotsEffects]),
        importProvidersFrom(FontAwesomeModule, NgbModule),
        ...(environment.mock ? servicesMockProviders : servicesProviders),
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        provideAppInitializer(initializeApp),
    ],
};
