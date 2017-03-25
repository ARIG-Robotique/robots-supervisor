import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterModule, Routes} from "@angular/router";
import {RobotComponent} from "./robot/robot.component";
import {RobotsService} from "./robots.service";
import {HomeComponent} from "./home/home.component";
import {MaterialModule} from "@angular/material";
import {ServoSliderComponent} from "./servo-slider/servo-slider.component";
import {ServosService} from "./servos.service";
import { MouvementInputComponent } from './mouvement-input/mouvement-input.component';
import { ServoButtonsComponent } from './servo-buttons/servo-buttons.component';

const appRoutes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'robot/:id', component: RobotComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    RobotComponent,
    HomeComponent,
    ServoSliderComponent,
    MouvementInputComponent,
    ServoButtonsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule
  ],
  providers: [
    RobotsService,
    ServosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
