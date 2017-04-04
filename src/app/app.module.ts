import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterModule} from "@angular/router";
import {RobotComponent} from "./robot/robot.component";
import {RobotsService} from "./services/robots.service";
import {HomeComponent} from "./home/home.component";
import {ServoControlComponent} from "./servo-control/servo-control.component";
import {ServosService} from "./services/servos.service";
import {MouvementInputComponent} from "./mouvement-input/mouvement-input.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Angular2FontAwesomeModule} from "angular2-font-awesome/angular2-font-awesome";
import {ServosComponent} from "./servos/servos.component";
import {MouvementsComponent} from "./mouvements/mouvements.component";
import {RobotResolve} from "./resolvers/RobotResolve";
import {AppRoutes} from "./app.routes";
import {RobotInfoComponent} from "./robot-info/robot-info.component";
import {MouvementsService} from "./services/mouvements.service";
import {MapComponent} from "./map/map.component";
import {MapInputComponent} from "./map-input/map-input.component";

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
    MapInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
    NgbModule.forRoot(),
    Angular2FontAwesomeModule
  ],
  providers: [
    RobotsService,
    ServosService,
    MouvementsService,
    RobotResolve
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
