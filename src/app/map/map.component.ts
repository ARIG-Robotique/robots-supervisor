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

  Tables:Table[];
  currentTable:Table;

  robot:Robot;
  robotPosition:RobotPosition;

  targetPosition:RobotPosition;

  Modes:any = [
    {name: 'path', label:'path'},
    {name: 'position', label:'direct'}
  ];
  currentMode:string = 'position';

  constructor(private route:ActivatedRoute,
              private mouvementsService:MouvementsService) {
  }

  ngOnInit() {
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.mouvementsService.getPosition(this.robot)
        .then((position:RobotPosition) => this.robotPosition = this.targetPosition = position);
    });

    IntervalObservable.create(200).subscribe(() => {
      this.mouvementsService.getPosition(this.robot)
        .then((position:RobotPosition) => this.robotPosition = position);
    });
  }

  positionChanged(position:RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
      x: position.x,
      y: position.y
    });
  }

  angleChanged(position:RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle
    });
  }

}
