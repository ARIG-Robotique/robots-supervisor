import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'

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
    RobotInfoComponent,
    MapComponent,
    MapInputComponent,
    CapteursComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
    NgbModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [
    RobotsService,
    ServosService,
    MouvementsService,
    RobotResolve,
    CapteursService,
    CodeursService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
