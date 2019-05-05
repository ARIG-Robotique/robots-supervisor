import {RobotTabComponent} from "../robot/robotTab.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {RobotsService} from "../../services/robots.service";
import {Table} from "../../models/Table";
import {IntervalObservable} from "rxjs-compat/observable/IntervalObservable";
import {Tables} from '../../constants/tables.constants';
import {CapteursService} from "../../services/capteurs.service";
import {Robot} from "../../models/Robot";
import {MouvementsService} from "../../services/mouvements.service";
import {RobotPosition} from "../../models/RobotPosition";
import {MapInputComponent} from "../../components/map-input/map-input.component";
import {Constants} from "../../constants/constants";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends RobotTabComponent implements OnInit {

  @ViewChild(MapInputComponent) mapinputComponent: MapInputComponent;

  Tables: Table[];
  currentTable: Table;

  team: string;
  robotPosition: RobotPosition;

  targetPosition: RobotPosition;

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
  currentZoom = 0.75;

  constructor(protected robotsService: RobotsService,
              private mouvementsService: MouvementsService,
              private capteursService: CapteursService) {
    super(robotsService);
  }

  preOnInit() {
    console.log('map preOnInit');
    this.Tables = Tables;
    this.currentTable = Tables[0];
    this.robotPosition = Constants.robot.configInitJaune;
  }

  protected afterFetchedRobots() {
    this.robots.forEach(robot => {
      this.capteursService.getCapteurs(robot)
        .subscribe((capteurs: any) => {
          console.log(capteurs);
          robot.capteurs = capteurs;
          this.team = capteurs.text.Equipe;
        });
      this.subs.push(IntervalObservable.create(200).subscribe(() => {
        this.fetch(robot);
      }));
    });
  }

  fetch(robot: Robot) {
    this.mouvementsService.getPosition(robot)
      .subscribe((position: RobotPosition) => {
        this.robotPosition = position;
      });
  }

  positionChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robots[0], this.currentMode, {
      x: position.x,
      y: position.y
    }).subscribe(() => {
    });
  }

  angleChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robots[0], 'orientation', {
      angle: position.angle
    }).subscribe(() => {
    });
  }
}
