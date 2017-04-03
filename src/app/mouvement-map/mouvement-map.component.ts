import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {Tables} from "../constants/tables.constants";
import {Table} from "../models/Table";
import {MouvementsService} from "../services/mouvements.service";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import {Robot} from "../models/Robot";
import {RobotPosition} from "../models/RobotPosition";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mouvement-map',
  templateUrl: './mouvement-map.component.html',
  styleUrls: ['./mouvement-map.component.scss']
})
export class MouvementMapComponent implements OnInit {

  @ViewChild('mapContainer') mapContainer:ElementRef;

  Math:any;

  Tables:Table[];
  currentTable:Table;

  robot:Robot;
  robotPosition:RobotPosition;

  targetPosition:RobotPosition = {x: 0, y: 0, angle: 0};

  state:any = {};

  constructor(private route:ActivatedRoute,
              private mouvementsService:MouvementsService) {
  }

  ngOnInit() {
    this.Math = Math;
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];
    });

    IntervalObservable.create(1000).subscribe(() => {
      this.mouvementsService.getPosition(this.robot)
        .then((position:RobotPosition) => this.robotPosition = position);
    });
  }

  mousedown($event) {
    let boundingRect = this.mapContainer.nativeElement.getBoundingClientRect();

    this.state.startX = $event.clientX - boundingRect.left;
    this.state.startY = $event.clientY - boundingRect.top;
  }

  mousemove($event) {
    let boundingRect = this.mapContainer.nativeElement.getBoundingClientRect();

    this.state.endX = $event.clientX - boundingRect.left;
    this.state.endY = $event.clientY - boundingRect.top;

    let dx = this.state.endX - this.state.startX;
    let dy = this.state.startY - this.state.endY;
    this.state.angle = Math.atan2(dy, dx);
    if (this.state.angle < 0) this.state.angle+= 2 * Math.PI;

    this.state.moving = Math.abs(this.state.startX - this.state.endX) > 10 || Math.abs(this.state.startY - this.state.endY) > 10;
  }

  mouseup($event) {
    if (this.state.moving) {
      this.targetPosition = {
        x: this.robotPosition.x,
        y: this.robotPosition.y,
        angle: this.state.angle * 180 / Math.PI
      };
    }
    else {
      this.targetPosition = {
        x: (this.state.startX) / this.currentTable.imageWidth * this.currentTable.width,
        y: this.currentTable.height - (this.state.startY) / this.currentTable.imageHeight * this.currentTable.height,
        angle: this.robotPosition.angle
      };
    }

    // TODO appel service

    this.state = {};
  }

}
