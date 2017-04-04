import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from "@angular/core";
import {Table} from "../models/Table";
import {RobotPosition} from "../models/RobotPosition";

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnInit {

  @Input() table:Table;
  @Input() robotPosition:RobotPosition;

  @Output() positionChanged = new EventEmitter<RobotPosition>();
  @Output() angleChanged = new EventEmitter<RobotPosition>();

  @ViewChild('mapContainer') mapContainer:ElementRef;

  Math:any;

  targetPosition:RobotPosition = {x: 0, y: 0, angle: 0};

  state:any = {};

  constructor() {
  }

  ngOnInit() {
    this.Math = Math;
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
    if (this.state.angle < 0) this.state.angle += 2 * Math.PI;

    this.state.moving = Math.abs(this.state.startX - this.state.endX) > 10 || Math.abs(this.state.startY - this.state.endY) > 10;
  }

  mouseup($event) {
    if (this.state.moving) {
      this.targetPosition = {
        x: this.robotPosition.x,
        y: this.robotPosition.y,
        angle: this.state.angle * 180 / Math.PI
      };

      this.angleChanged.emit(this.targetPosition);
    }
    else {
      this.targetPosition = {
        x: (this.state.startX) / this.table.imageRatio,
        y: this.table.height - (this.state.startY) / this.table.imageRatio,
        angle: this.robotPosition.angle
      };

      this.positionChanged.emit(this.targetPosition);
    }

    this.state = {};
  }

}
