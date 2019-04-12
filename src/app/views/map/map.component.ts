import {RobotTabComponent} from "../robot/robotTab.component";
import {Component} from "@angular/core";
import {RobotsService} from "../../services/robots.service";
import {Table} from "../../models/Table";
import {IntervalObservable} from "rxjs-compat/observable/IntervalObservable";
import {Tables} from '../../constants/tables.constants';
import {CapteursService} from "../../services/capteurs.service";
import {Robot} from "../../models/Robot";
import {MouvementsService} from "../../services/mouvements.service";
import {RobotPosition} from "../../models/RobotPosition";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends RobotTabComponent {

  Tables: Table[];
  currentTable: Table;

  Modes: any = [
    {name: 'path', label: 'path'},
    {name: 'position', label: 'direct'}
  ];

  Zooms: any = [
    {level: 0.5, label: '50%'},
    {level: 0.75, label: '75%'},
    {level: 1.0, label: '100%'}
  ];

  currentMode = 'path';
  currentZoom = 1.0;

  constructor(protected robotsService: RobotsService,
              private mouvementsService: MouvementsService,
              private capteursService: CapteursService) {
    super(robotsService);
  }

  protected afterFetchedRobots() {
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.robots.forEach(robot => {
      this.capteursService.getCapteurs(robot)
        .subscribe((capteurs: any) => {
          robot.capteurs = capteurs;
          robot.team = capteurs.text.Equipe;
        });
      this.subs.push(IntervalObservable.create(200).subscribe(() => {
        this.fetch(robot);
      }));
    });
  }

  fetch(robot: Robot) {
    this.mouvementsService.getPosition(robot)
      .subscribe((position: RobotPosition) => robot.position = position);
  }


  positionChanged(position: RobotPosition) {
    // this.targetPosition = position;
    //
    // this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
    //   x: position.x,
    //   y: position.y
    // }).subscribe(() => {});
  }

  angleChanged(position: RobotPosition) {
    // this.targetPosition = position;
    //
    // this.mouvementsService.sendMouvement(this.robot, 'orientation', {
    //   angle: position.angle
    // }).subscribe(() => {});
  }
}
