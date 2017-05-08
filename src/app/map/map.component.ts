import {Component, OnInit} from "@angular/core";
import {Tables} from "../constants/tables.constants";
import {Table} from "../models/Table";
import {Robot} from "../models/Robot";
import {RobotPosition} from "../models/RobotPosition";
import {ActivatedRoute} from "@angular/router";
import {MouvementsService} from "../services/mouvements.service";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  Tables: Table[];
  currentTable: Table;

  robot: Robot;
  robotPosition: RobotPosition;

  targetPosition: RobotPosition;

  Modes: any = [
    {name: 'path', label: 'path'},
    {name: 'position', label: 'direct'}
  ];
  currentMode: string = 'position';

  Rotations: any = [
    {angle: 0, label: '0°'},
    {angle: 90, label: '90°'}
  ];
  currentRotation: number = 0;

  Zooms: any = [
    {level: 0.5, label: '50%'},
    {level: 0.75, label: '75%'},
    {level: 1.0, label: '100%'}
  ];
  currentZoom: number = 1.0;

  constructor(private route: ActivatedRoute,
              private mouvementsService: MouvementsService) {
  }

  ngOnInit() {
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.fetch();
    });

    IntervalObservable.create(200).subscribe(() => {
      if (this.robot) {
        this.fetch();
      }
    });
  }

  fetch() {
    this.mouvementsService.getPosition(this.robot)
      .then((position: RobotPosition) => this.robotPosition = position);
  }

  positionChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
      x: position.x,
      y: position.y
    });
  }

  angleChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle
    });
  }

}
