import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Table} from '../models/Table';
import {RobotPosition} from '../models/RobotPosition';
import * as Konva from 'konva';

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnChanges, AfterViewInit {

  @Input() table: Table;
  @Input() tableZoom: number;

  @Input() robotPosition: RobotPosition;

  @Output() positionChanged = new EventEmitter<RobotPosition>();
  @Output() angleChanged = new EventEmitter<RobotPosition>();

  @ViewChild('mapContainer') mapContainer: ElementRef;

  targetPosition: RobotPosition = {x: 0, y: 0, angle: 0};

  state: any = {};

  stage: Konva.Stage;
  mainLayer: Konva.Layer;
  image: Konva.Image;
  robot: Konva.Group;
  target: Konva.Group;
  director: Konva.Arrow;

  constructor() {
  }

  ngAfterViewInit() {

    this.stage = new Konva.Stage({
      container: this.mapContainer.nativeElement,
      width: this.table.width * this.table.imageRatio,
      height: this.table.height * this.table.imageRatio
    });

    this.stage.on('mousedown', this.mousedown.bind(this));
    this.stage.on('mousemove', this.mousemove.bind(this));
    this.stage.on('mouseup', this.mouseup.bind(this));

    this.mainLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);

    this.robot = this.buildRobot();
    this.mainLayer.add(this.robot);

    this.target = this.buildTarget();
    this.mainLayer.add(this.target);

    this.director = this.buildDirector();
    this.mainLayer.add(this.director);

    this.setZoom(this.tableZoom);
    this.setTable(this.table);
    this.moveTarget(this.targetPosition);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableZoom']) {
      this.setZoom(this.tableZoom);
    }
    if (changes['table']) {
      this.setTable(this.table);
    }
    if (changes['robotPosition']) {
      this.moveRobot(this.robotPosition);
    }
  }

  buildRobot(): Konva.Group {
    const robot = new Konva.Group();

    robot.add(new Konva.RegularPolygon({
      x: 0,
      y: 0,
      sides: 8,
      radius: 50,
      rotation: 22.5,
      fill: 'rgba(245, 32, 32, 0.7)'
    }));

    return robot;
  }

  buildTarget(): Konva.Group {
    const target = new Konva.Group();

    target.add(new Konva.Line({
      x: 0,
      y: -30,
      points: [0, 0, 0, 60],
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Arrow({
      x: -30,
      y: 0,
      points: [0, 0, 75, 0],
      stroke: '#5cb85c',
      fill: '#5cb85c',
      strokeWidth: 2,
      pointerLength: 10,
      pointerWidth: 10
    }));

    target.add(new Konva.Circle({
      x: 0,
      y: 0,
      radius: 10,
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x: 0,
      y: 0,
      radius: 20,
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    return target;
  }

  buildDirector(): Konva.Arrow {
    return new Konva.Arrow({
      x: 0,
      y: 0,
      points: [0, 0, 100, 0],
      stroke: '#5cb85c',
      fill: '#5cb85c',
      strokeWidth: 4,
      pointerLength: 10,
      pointerWidth: 10,
      visible: false
    });
  }

  setZoom(zoom: number) {
    if (this.stage) {
      this.stage.setWidth(this.table.width * this.table.imageRatio * zoom);
      this.stage.setHeight(this.table.height * this.table.imageRatio * zoom);

      this.mainLayer.scale({x: zoom, y: zoom});
    }
  }

  setTable(table: Table) {
    if (this.stage) {
      if (this.image) {
        this.image.remove();
        this.image.destroy();
      }

      const imageLoader = new Image();

      imageLoader.onload = function () {
        this.image = new Konva.Image({
          x: 0,
          y: 0,
          image: imageLoader,
          width: table.width * table.imageRatio,
          height: table.height * table.imageRatio
        });

        this.mainLayer.add(this.image);
        this.image.moveToBottom();

        this.setZoom(this.tableZoom);
      }.bind(this);

      imageLoader.src = 'assets/tables/' + table.name + '.png';
    }
  }

  moveRobot(position: RobotPosition) {
    if (this.stage) {
      this.robot.position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });
      this.robot.rotation(position.angle);
    }
  }

  moveTarget(position: RobotPosition) {
    if (this.stage) {
      this.target.position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });
      this.target.rotation(-position.angle);
      this.mainLayer.drawScene();
    }
  }

  mousedown(e) {
    const $event = e.evt;

    const boundingRect = this.mapContainer.nativeElement.getBoundingClientRect();

    this.state.startX = $event.clientX - boundingRect.left;
    this.state.startY = $event.clientY - boundingRect.top;
    this.state.down = true;
  }

  mousemove(e) {
    const $event = e.evt;

    if (this.state.down) {
      const boundingRect = this.mapContainer.nativeElement.getBoundingClientRect();

      this.state.endX = $event.clientX - boundingRect.left;
      this.state.endY = $event.clientY - boundingRect.top;

      const dx = this.state.endX - this.state.startX;
      const dy = this.state.startY - this.state.endY;

      this.state.angle = Math.atan2(dy, dx);
      if (this.state.angle < 0) {
        this.state.angle += 2 * Math.PI;
      }
      if (this.state.angle > 2 * Math.PI) {
        this.state.angle -= 2 * Math.PI;
      }

      this.state.moving = Math.abs(this.state.startX - this.state.endX) > 10 || Math.abs(this.state.startY - this.state.endY) > 10;

      if (this.state.moving) {
        this.director.visible(true);
        this.director.position({
          x: this.state.startX,
          y: this.state.startY
        });
        this.director.rotation(-Math.atan2(dy, dx) / Math.PI * 180);
        this.mainLayer.drawScene();
      }
    }
  }

  mouseup(e) {
    const $event = e.evt;

    this.robotPosition = {x: 300, y: 1600, angle: 90};

    if (this.state.moving) {
      this.targetPosition = {
        x: this.robotPosition.x,
        y: this.robotPosition.y,
        angle: this.state.angle * 180 / Math.PI
      };

      this.angleChanged.emit(this.targetPosition);

    } else {
      this.targetPosition = {
        x: this.state.startX / this.table.imageRatio / this.tableZoom,
        y: this.table.height - this.state.startY / this.table.imageRatio / this.tableZoom,
        angle: this.robotPosition.angle
      };

      this.positionChanged.emit(this.targetPosition);
      this.moveTarget(this.targetPosition);
    }

    this.state = {};
  }

}
