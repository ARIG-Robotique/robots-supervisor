import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {Table} from "../../models/Table";
import {RobotEvent} from "../../models/robotEvent";
import * as Konva from "konva";
import {RobotPosition} from "../../models/RobotPosition";
import {Point} from "../../models/Point";
import {Robot} from "../../models/Robot";

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnChanges, AfterViewInit {
  @Input() table: Table;
  @Input() tableZoom: number;
  @Input() robots: Robot[];

  @Output() positionChanged = new EventEmitter<RobotEvent>();
  @Output() angleChanged = new EventEmitter<RobotEvent>();

  @ViewChild('mapContainer') mapContainer: ElementRef;

  state: any = {};
  targetPosition: RobotPosition = {x: 0, y: 0, angle: 0};

  stage: Konva.Stage;
  mainLayer: Konva.Layer;
  background: Konva.Layer;
  nerell: Konva.Group;
  elfa: Konva.Group;
  target: Konva.Group;
  director: Konva.Group;
  crosshairLayer: Konva.Layer;
  crosshair: Konva.Group;
  points: Konva.Group;
  mouvement: Konva.Group;

  ngAfterViewInit(): void {
    console.log('MapInput view init');

    this.stage = new Konva.Stage({
      container: this.mapContainer.nativeElement,
      width: this.table.width * this.table.imageRatio,
      height: this.table.height * this.table.imageRatio
    });

    this.stage.on('mousedown', this.mousedown.bind(this));
    this.stage.on('mousemove', this.mousemove.bind(this));
    this.stage.on('mouseup', this.mouseup.bind(this));

    this.background = new Konva.Layer();
    this.stage.add(this.background);

    this.mainLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);

    this.nerell = this.buildNerell();
    this.mainLayer.add(this.nerell);

    this.elfa = this.buildElfa();
    this.mainLayer.add(this.elfa);

    this.target = this.buildTarget();
    this.mainLayer.add(this.target);

    this.director = this.buildDirector();
    this.mainLayer.add(this.director);

    this.points = new Konva.Group();
    this.mainLayer.add(this.points);

    this.mouvement = new Konva.Group();
    this.mainLayer.add(this.mouvement);

    this.crosshairLayer = new Konva.Layer();
    this.stage.add(this.crosshairLayer);

    this.crosshair = this.buildCrossHair();
    this.crosshairLayer.add(this.crosshair);

    this.setZoom();
    this.moveTarget(this.targetPosition);
  }

  ngOnChanges(changes: SimpleChanges): void {
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

    const boundingRect = this.mapContainer.nativeElement.getBoundingClientRect();

    this.state.endX = $event.clientX - boundingRect.left;
    this.state.endY = $event.clientY - boundingRect.top;

    if (this.state.down) {
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
        this.moveDirector({
          x: this.state.startX,
          y: this.state.startY
        }, {
          x: dx,
          y: dy
        });
      }
    }

    this.moveCrosshair({
      x: this.state.endX,
      y: this.state.endY
    });
  }

  mouseup(e) {
    if (this.state.moving) {
      this.targetPosition = {
        x: this.robots[0].position.x,
        y: this.robots[0].position.y,
        angle: this.state.angle * 180 / Math.PI
      };

      if (this.targetPosition.angle > 180) {
        this.targetPosition.angle -= 360;
      }

      this.angleChanged.emit(this.targetPosition);
      this.target.visible(false);

    } else {
      this.targetPosition = {
        x: this.state.startX / this.table.imageRatio / this.tableZoom,
        y: this.table.height - this.state.startY / this.table.imageRatio / this.tableZoom,
        angle: this.robots[0].position.angle
      };

      this.positionChanged.emit(this.targetPosition);
      this.moveTarget(this.targetPosition);
      this.director.visible(false);
    }

    this.state = {};
  }

  buildNerell(): Konva.Group {
    const robot = new Konva.Group();

    const imageLoader = new Image();

    imageLoader.onload = function () {
      robot.add(new Konva.Image({
        x: -65, y: -65,
        image: imageLoader,
        width: 130,
        height: 130,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowBlur: 20
      }));

    }.bind(this);

    imageLoader.src = 'assets/robots/nerell.png';

    return robot;
  }

  buildElfa(): Konva.Group {
    const robot = new Konva.Group();

    const imageLoader = new Image();

    imageLoader.onload = function () {
      robot.add(new Konva.Image({
        x: -55, y: -55,
        image: imageLoader,
        width: 110,
        height: 110,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowBlur: 20
      }));

    }.bind(this);

    imageLoader.src = 'assets/robots/elfa.png';

    return robot;
  }

  buildTarget(): Konva.Group {
    const target = new Konva.Group({
      visible: false
    });

    target.add(new Konva.Line({
      x: 0, y: -30,
      points: [0, 0, 0, 60],
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Line({
      x: -30, y: 0,
      points: [0, 0, 60, 0],
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x: 0, y: 0,
      radius: 10,
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x: 0, y: 0,
      radius: 20,
      stroke: '#5cb85c',
      strokeWidth: 2
    }));

    return target;
  }

  buildDirector(): Konva.Group {
    const director = new Konva.Group({
      visible: false
    });

    director.add(new Konva.Arrow({
      x: 0, y: 0,
      points: [0, 0, 100, 0],
      stroke: '#5cb85c',
      fill: '#5cb85c',
      strokeWidth: 4,
      pointerLength: 10,
      pointerWidth: 10
    }));

    director.add(new Konva.Text({
      text: '',
      x: 120, y: -8,
      align: 'center',
      fontSize: 16,
      fontStyle: 'bold',
      fill: 'black'
    }));

    return director;
  }

  buildCrossHair() {
    const crosshair = new Konva.Group();

    crosshair.add(new Konva.Line({
      x: -10, y: 0,
      points: [0, 0, 20, 0],
      stroke: 'black',
      strokeWidth: 1
    }));

    crosshair.add(new Konva.Line({
      x: 0, y: -10,
      points: [0, 0, 0, 20],
      stroke: 'black',
      strokeWidth: 1
    }));

    crosshair.add(new Konva.Text({
      x: 5, y: 5,
      text: '0 : 0',
      fontSize: 16,
      fontStyle: 'bold',
      fill: 'black'
    }));

    return crosshair;
  }

  setZoom() {
    if (this.stage && this.tableZoom) {
      this.stage.setWidth(this.table.width * this.table.imageRatio * this.tableZoom);
      this.stage.setHeight(this.table.height * this.table.imageRatio * this.tableZoom);

      this.mainLayer.scale({x: this.tableZoom, y: this.tableZoom});
      this.background.scale({x: this.tableZoom, y: this.tableZoom});
    }
  }

  moveTarget(position: RobotPosition) {
    if (this.target && this.table) {
      this.target.visible(true);
      this.target.position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });
      this.mainLayer.drawScene();
    }
  }

  moveDirector(position: Point, delta: Point) {
    if (this.director) {
      this.director.visible(true);
      this.director.position(position);
      this.director.rotation(-Math.atan2(delta.y, delta.x) / Math.PI * 180);

      const text = this.director.getChildren((children) => children instanceof Konva.Text)[0];
      text.text(-this.director.rotation().toFixed(1) + '°');
      text.rotation(-this.director.rotation());

      this.mainLayer.drawScene();
    }
  }

  moveCrosshair(position: Point) {
    if (this.crosshair) {
      this.crosshair.position(position);

      const text = this.crosshair.getChildren((children) => children instanceof Konva.Text)[0];
      text.text((position.x / this.table.imageRatio / this.tableZoom).toFixed(0) + ':' +
        (this.table.height - position.y / this.table.imageRatio / this.tableZoom).toFixed(0));

      this.crosshairLayer.drawScene();
    }
  }
}
