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
import Konva from 'konva';
import { Constants } from '../../constants/constants';
import { MapPosition } from '../../models/MapPosition';
import { Point } from '../../models/Point';
import { Position } from '../../models/Position';
import { Table } from '../../models/Table';
import { GameStatusManager } from './game-status.manager';

@Component({
  selector : 'arig-map-input',
  template : '<div #mapContainer class="map-container"></div>',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnChanges, AfterViewInit {

  @Input() team: string;
  @Input() table: Table;
  @Input() mainRobot: string;

  @Output() positionChanged = new EventEmitter<Pick<MapPosition, 'x' | 'y'>>();
  @Output() angleChanged = new EventEmitter<Pick<MapPosition, 'angle'>>();

  @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;

  state: any = {};
  tableZoom = 0.85;

  stage: Konva.Stage;
  mainLayer: Konva.Layer;
  background: Konva.Layer;
  robots: { [K: string]: Konva.Group } = {};
  target: Konva.Group;
  director: Konva.Group;
  crosshairLayer: Konva.Layer;
  crosshair: Konva.Group;
  points: Konva.Group;
  mouvement: Konva.Group;
  statusManager: GameStatusManager;

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: this.mapContainer.nativeElement,
      width    : this.table.width * this.table.imageRatio * this.tableZoom,
      height   : this.table.height * this.table.imageRatio * this.tableZoom,
    });

    this.stage.on('mousedown', this.mousedown.bind(this));
    this.stage.on('mousemove', this.mousemove.bind(this));
    this.stage.on('mouseup', this.mouseup.bind(this));

    this.background = new Konva.Layer();
    this.stage.add(this.background);

    this.mainLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);

    this.robots['nerell'] = this.buildRobot('nerell');
    this.robots['odin'] = this.buildRobot('odin');
    this.mainLayer.add(this.robots['nerell']);
    this.mainLayer.add(this.robots['odin']);

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

    this.mainLayer.scale({ x: this.tableZoom, y: this.tableZoom });
    this.background.scale({ x: this.tableZoom, y: this.tableZoom });

    this.moveTarget({ x: 0, y: 0 });
    this.moveRobot('nerell', { x: 0, y: 0, angle: 0 });
    this.moveRobot('odin', { x: 0, y: 0, angle: 0 });

    if (this.table.name !== 'test') {
      this.statusManager = new GameStatusManager(this.mainLayer, this.table);
    }

    this.mainLayer.draw();

    this.setTable(this.table, this.team, this.mainRobot);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] || changes['team'] || changes['mainRobot']) {
      this.setTable(this.table, this.team, this.mainRobot);
    }

    if (changes['table']) {
      if (this.table.name === 'test') {
        this.statusManager.destroy();
        this.statusManager = null;
      } else if (this.mainLayer) {
        this.statusManager = new GameStatusManager(this.mainLayer, this.table);
      }
    }
  }

  setPosition(name: string, main: boolean, position: Position) {
    if (this.stage) {
      this.moveRobot(name, position);

      if (main) {
        this.drawPoints(position);
        this.drawMouvement(position);

        if (this.statusManager && position.gameStatus) {
          this.statusManager.update(position.gameStatus, this.team);
        }
      }

      this.mainLayer.draw();
    }
  }

  setTable(table: Table, team: string, mainRobot: string) {
    if (table && this.stage) {
      let done = 0;
      let todo = 0;
      const checkDone = () => {
        done++;
        if (done === todo) {
          this.stage.width(this.table.width * this.table.imageRatio * this.tableZoom);
          this.stage.height(this.table.height * this.table.imageRatio * this.tableZoom);

          this.stage.draw();
        }
      };

      this.background.removeChildren();

      todo++;
      const tableLoader = new Image();

      tableLoader.onload = () => {
        const image = new Konva.Image({
          x     : 0,
          y     : 0,
          image : tableLoader,
          width : table.width * table.imageRatio,
          height: table.height * table.imageRatio
        });

        this.background.add(image);
        image.moveToBottom();

        checkDone();
      };

      tableLoader.src = 'assets/tables/' + table.name + '.png';

      if (this.table.name !== 'test' && team) {
        todo++;
        const maskLoader = new Image();

        maskLoader.onload = () => {
          const image = new Konva.Image({
            x      : 0,
            y      : 0,
            image  : maskLoader,
            width  : table.width * table.imageRatio,
            height : table.height * table.imageRatio,
            opacity: 0.15
          });

          image.cache();
          image.filters([Konva.Filters.Pixelate]);
          image.pixelSize(table.width * table.imageRatio / maskLoader.width);

          this.background.add(image);
          image.moveToTop();

          checkDone();
        };

        maskLoader.src = 'assets/pathMasks/' + table.name + '-' + team + '-' + mainRobot + '.png';
      }
    }
  }

  moveRobot(name: string, position: MapPosition) {
    if (this.robots[name] && position) {
      this.robots[name].position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });
      this.robots[name].rotation(-position.angle - 180);
    }
  }

  drawPoints(data: Position) {
    if (data && this.stage) {
      this.points.removeChildren();

      if (data.pointsLidar) {
        data.pointsLidar.forEach((point) => {
          this.points.add(new Konva.Circle({
            x     : point.x * this.table.imageRatio,
            y     : (this.table.height - point.y) * this.table.imageRatio,
            radius: this.tableZoom * 4,
            fill  : 'white'
          }));
        });
      }

      if (data.collisions) {
        data.collisions.forEach((collision) => {
          switch (collision.type) {
            case 'CIRCLE':
              this.points.add(new Konva.Circle({
                x     : collision.centre.x * this.table.imageRatio,
                y     : (this.table.height - collision.centre.y) * this.table.imageRatio,
                radius: collision.rayon * this.table.imageRatio,
                fill  : 'rgba(0, 0, 0, 0.2)'
              }));

              this.points.add(new Konva.Circle({
                x     : collision.centre.x * this.table.imageRatio,
                y     : (this.table.height - collision.centre.y) * this.table.imageRatio,
                radius: this.tableZoom * 4,
                fill  : 'red'
              }));
              break;

            case 'RECTANGLE':
              this.points.add(new Konva.Rect({
                x     : collision.x * this.table.imageRatio,
                y     : (this.table.height - collision.y) * this.table.imageRatio - collision.h * this.table.imageRatio,
                width : collision.w * this.table.imageRatio,
                height: collision.h * this.table.imageRatio,
                fill  : 'rgba(0, 0, 0, 0.2)'
              }));

              this.points.add(new Konva.Circle({
                x     : collision.x * this.table.imageRatio,
                y     : (this.table.height - collision.y) * this.table.imageRatio - collision.h * this.table.imageRatio,
                radius: this.tableZoom * 4,
                fill  : 'red'
              }));
              break;
          }
        });
      }
    }
  }

  drawMouvement(data: Position) {
    if (data && this.stage) {
      this.mouvement.removeChildren();

      const points = [];

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
              x            : 0,
              y            : 0,
              points       : points,
              stroke       : 'red',
              fill         : 'red',
              strokeWidth  : 2,
              pointerLength: 5,
              pointerWidth : 5
            }));
            break;

          case 'ROTATION':
            this.mouvement.add(new Konva.Arrow({
              x            : data.x * this.table.imageRatio,
              y            : (this.table.height - data.y) * this.table.imageRatio,
              rotation     : -data.targetMvt.toAngle,
              points       : [0, 0, 100, 0],
              stroke       : 'red',
              fill         : 'red',
              strokeWidth  : 4,
              pointerLength: 10,
              pointerWidth : 10
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
              x          : 0,
              y          : 0,
              points     : points,
              stroke     : 'red',
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

    if (this.state.moving) {
      this.crosshair.visible(false);
      this.crosshairLayer.draw();
    } else {
      this.crosshair.visible(true);
      this.moveCrosshair({
        x: this.state.endX,
        y: this.state.endY
      });
    }
  }

  mouseup() {
    if (this.state.moving) {
      const position = {
        angle: this.state.angle * 180 / Math.PI,
      };

      if (position.angle > 180) {
        position.angle -= 360;
      }

      this.target.visible(false);

      this.angleChanged.emit(position);

    } else {
      const position = {
        x: this.state.startX / this.table.imageRatio / this.tableZoom,
        y: this.table.height - this.state.startY / this.table.imageRatio / this.tableZoom,
      };

      this.moveTarget(position);
      this.director.visible(false);

      this.positionChanged.emit(position);
    }

    this.state = {};
  }

  private buildRobot(name: string): Konva.Group {
    const robot = new Konva.Group();

    const imageLoader = new Image();

    imageLoader.onload = () => {
      robot.add(new Konva.Image({
        x            : -Constants.robot.size.width / 2,
        y            : -Constants.robot.size.height / 2,
        image        : imageLoader,
        width        : Constants.robot.size.width,
        height       : Constants.robot.size.height,
        shadowColor  : 'black',
        shadowOpacity: 1,
        shadowBlur   : 20
      }));
    };

    imageLoader.src = `assets/robots/${name}.png`;

    return robot;
  }

  private buildTarget(): Konva.Group {
    const target = new Konva.Group({
      visible: false
    });

    target.add(new Konva.Line({
      x          : 0, y: -30,
      points     : [0, 0, 0, 60],
      stroke     : '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Line({
      x          : -30, y: 0,
      points     : [0, 0, 60, 0],
      stroke     : '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x          : 0, y: 0,
      radius     : 10,
      stroke     : '#5cb85c',
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x          : 0, y: 0,
      radius     : 20,
      stroke     : '#5cb85c',
      strokeWidth: 2
    }));

    return target;
  }

  private buildDirector(): Konva.Group {
    const director = new Konva.Group({
      visible: false
    });

    director.add(new Konva.Arrow({
      x            : 0,
      y            : 0,
      points       : [0, 0, 100, 0],
      stroke       : '#5cb85c',
      fill         : '#5cb85c',
      strokeWidth  : 4,
      pointerLength: 10,
      pointerWidth : 10
    }));

    director.add(new Konva.Text({
      text     : '',
      x        : 120,
      y        : -8,
      align    : 'center',
      fontSize : 16,
      fontStyle: 'bold',
      fill     : 'white'
    }));

    return director;
  }

  private buildCrossHair() {
    const crosshair = new Konva.Group();

    crosshair.add(new Konva.Line({
      x          : -10,
      y          : 0,
      points     : [0, 0, 20, 0],
      stroke     : 'black',
      strokeWidth: 1
    }));

    crosshair.add(new Konva.Line({
      x          : 0,
      y          : -10,
      points     : [0, 0, 0, 20],
      stroke     : 'black',
      strokeWidth: 1
    }));

    crosshair.add(new Konva.Text({
      x        : 5,
      y        : 5,
      text     : '0 : 0',
      fontSize : 16,
      fontStyle: 'bold',
      fill     : 'white'
    }));

    return crosshair;
  }

  moveTarget(position: Pick<MapPosition, 'x' | 'y'>) {
    if (this.target) {
      this.target.visible(true);
      this.target.position({
        x: position.x * this.table.imageRatio,
        y: (this.table.height - position.y) * this.table.imageRatio
      });

      this.mainLayer.draw();
    }
  }

  moveDirector(position: Point, delta: Point) {
    if (this.director) {
      this.director.visible(true);
      this.director.position({
        x: position.x / this.tableZoom,
        y: position.y / this.tableZoom,
      });
      this.director.rotation(-Math.atan2(delta.y, delta.x) / Math.PI * 180);

      const text = this.director.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
      text.text(-this.director.rotation().toFixed(1) + '°');
      text.rotation(-this.director.rotation());

      this.mainLayer.draw();
    }
  }

  moveCrosshair(position: Point) {
    if (this.crosshair) {
      this.crosshair.position(position);

      const text = this.crosshair.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
      text.text((position.x / this.table.imageRatio / this.tableZoom).toFixed(0) + ':' +
        (this.table.height - position.y / this.table.imageRatio / this.tableZoom).toFixed(0));

      this.crosshairLayer.draw();
    }
  }
}
