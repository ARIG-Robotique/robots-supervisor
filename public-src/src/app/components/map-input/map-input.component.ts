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
import {Table} from '../../models/Table';
import {RobotPosition} from '../../models/RobotPosition';
import * as Konva from 'konva';
import {Point} from '../../models/Point';

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnChanges, AfterViewInit {

  @Input() team: string;

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
  tableImg: Konva.Image;
  nerell: Konva.Group;
  elfa: Konva.Group;
  target: Konva.Group;
  director: Konva.Group;
  points: Konva.Group;
  mouvement: Konva.Group;

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

    this.setZoom(this.tableZoom);
    this.setTable(this.table);
    this.moveTarget(this.targetPosition);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableZoom'] && this.tableZoom) {
      this.setZoom(this.tableZoom);
    }
    if (changes['table'] && this.table) {
      this.setTable(this.table);
    }
    if (changes['robotPosition'] && this.robotPosition) {
      this.moveNerell(this.robotPosition);
      this.drawPoints(this.robotPosition);
      this.drawMouvement(this.robotPosition);

      this.mainLayer.drawScene();
    }
    if (changes['team']) {
      this.moveElfa();
    }
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

  setZoom(zoom: number) {
    if (this.stage) {
      this.stage.setWidth(this.table.width * this.table.imageRatio * zoom);
      this.stage.setHeight(this.table.height * this.table.imageRatio * zoom);

      this.mainLayer.scale({x: zoom, y: zoom});
    }
  }

  setTable(table: Table) {
    if (this.stage) {
      if (this.tableImg) {
        this.tableImg.remove();
        this.tableImg.destroy();
      }

      const imageLoader = new Image();

      imageLoader.onload = function () {
        this.tableImg = new Konva.Image({
          x: 0, y: 0,
          image: imageLoader,
          width: table.width * table.imageRatio,
          height: table.height * table.imageRatio,
          opacity: 0.8
        });

        this.mainLayer.add(this.tableImg);
        this.tableImg.moveToBottom();

        this.setZoom(this.tableZoom);
      }.bind(this);

      imageLoader.src = 'assets/tables/' + table.name + '.png';

      this.moveElfa();
    }
  }

  moveElfa() {
    if (this.elfa && this.team) {
      this.elfa.position({
        x: this.table.elfa[this.team].x * this.table.imageRatio,
        y: (this.table.height - this.table.elfa[this.team].y) * this.table.imageRatio
      });
      this.elfa.rotation(-this.table.elfa[this.team].a);
    }
  }

  moveNerell(position: RobotPosition) {
    if (this.nerell && this.table) {
      this.nerell.position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });
      this.nerell.rotation(-position.angle);
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

  drawPoints(data: RobotPosition) {
    if (this.points && this.table) {
      this.points.getChildren().each((item) => {
        item.remove();
        item.destroy();
      });

      if (data.pointsLidar) {
        data.pointsLidar.forEach((point) => {
          this.points.add(new Konva.Circle({
            x: point.x * this.table.imageRatio,
            y: (this.table.height - point.y) * this.table.imageRatio,
            radius: this.tableZoom * 4,
            fill: 'black'
          }));
        });
      }

      if (data.pointsCapteurs) {
        data.pointsCapteurs.forEach((point) => {
          this.points.add(new Konva.Circle({
            x: point.x * this.table.imageRatio,
            y: (this.table.height - point.y) * this.table.imageRatio,
            radius: this.tableZoom * 4,
            fill: 'black',
            stroke: 'rgba(0, 0, 0, 0.5)',
            strokeWidth: this.tableZoom * 20
          }));
        });
      }

      if (data.collisions) {
        data.collisions.forEach((rect) => {
          this.points.add(new Konva.Rect({
            x: rect.x * this.table.imageRatio,
            y: (this.table.height - rect.y) * this.table.imageRatio,
            width: rect.w * this.table.imageRatio,
            height: rect.h * this.table.imageRatio,
            fill: 'rgba(0, 0, 0, 0.5)'
          }));
        });
      }
    }
  }

  drawMouvement(data: RobotPosition) {
    if (this.mouvement && this.table) {
      this.mouvement.getChildren().each((item) => {
        item.remove();
        item.destroy();
      });

      let points = [];

      if (data.targetMvt) {
        switch (data.targetMvt.type) {
          case 'PATH':
            data.targetMvt.path.forEach(point => {
              points.push(
                point.x * this.table.imageRatio,
                (this.table.height - point.y) * this.table.imageRatio,
              );
            });

            this.mouvement.add(new Konva.Arrow({
              x: 0, y: 0,
              points: points,
              stroke: 'red',
              fill: 'red',
              strokeWidth: 2,
              pointerLength: 5,
              pointerWidth: 5
            }));
            break;

          case 'ROTATION':
            this.mouvement.add(new Konva.Arrow({
              x: data.x * this.table.imageRatio,
              y: (this.table.height - data.y) * this.table.imageRatio,
              rotation: -data.targetMvt.toAngle,
              points: [0, 0, 100, 0],
              stroke: 'red',
              fill: 'red',
              strokeWidth: 4,
              pointerLength: 10,
              pointerWidth: 10
            }));
            break;

          case 'TRANSLATION':
            points.push(
              data.targetMvt.fromPoint.x * this.table.imageRatio,
              (this.table.height - data.targetMvt.fromPoint.y) * this.table.imageRatio,
              data.targetMvt.toPoint.x * this.table.imageRatio,
              (this.table.height - data.targetMvt.toPoint.y) * this.table.imageRatio
            );

            this.mouvement.add(new Konva.Line({
              x: 0, y: 0,
              points: points,
              stroke: 'red',
              strokeWidth: 4
            }));
            break;
        }
      }
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
        this.moveDirector({
          x: this.state.startX,
          y: this.state.startY
        }, {
          x: dx,
          y: dy
        });
      }
    }
  }

  mouseup(e) {
    const $event = e.evt;

    if (this.state.moving) {
      this.targetPosition = {
        x: this.robotPosition.x,
        y: this.robotPosition.y,
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
        angle: this.robotPosition.angle
      };

      this.positionChanged.emit(this.targetPosition);
      this.moveTarget(this.targetPosition);
      this.director.visible(false);
    }

    this.state = {};
  }

}
