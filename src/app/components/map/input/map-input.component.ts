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
import { ROBOT_SIZE, TABLE } from '../../../constants/constants';
import { MapPosition } from '../../../models/MapPosition';
import { Point } from '../../../models/Point';
import { Position } from '../../../models/Position';
import { GameStatusManager } from './game-status.manager';

@Component({
  selector : 'arig-map-input',
  template : '<div #mapContainer class="map-container"></div>',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent implements OnChanges, AfterViewInit {

  @Input() team: string;
  @Input() mainRobot: string;

  @Output() positionChanged = new EventEmitter<Pick<MapPosition, 'x' | 'y'>>();
  @Output() angleChanged = new EventEmitter<Pick<MapPosition, 'angle'>>();

  @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;

  state: any = {};

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
      width    : TABLE.width * TABLE.imageRatio * TABLE.zoom,
      height   : TABLE.height * TABLE.imageRatio * TABLE.zoom,
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

    this.mainLayer.scale({ x: TABLE.zoom, y: TABLE.zoom });
    this.background.scale({ x: TABLE.zoom, y: TABLE.zoom });

    this.moveTarget({ x: 0, y: 0 });
    this.moveRobot('nerell', { x: 0, y: 0, angle: 0 });
    this.moveRobot('odin', { x: 0, y: 0, angle: 0 });

    this.statusManager = new GameStatusManager(this.mainLayer);

    this.mainLayer.draw();

    this.setTable(this.team, this.mainRobot);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team'] || changes['mainRobot']) {
      this.setTable(this.team, this.mainRobot);
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

  setTable(team: string, mainRobot: string) {
    if (this.stage) {
      let done = 0;
      let todo = 0;
      const checkDone = () => {
        done++;
        if (done === todo) {
          this.stage.width(TABLE.width * TABLE.imageRatio * TABLE.zoom);
          this.stage.height(TABLE.height * TABLE.imageRatio * TABLE.zoom);

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
          width : TABLE.width * TABLE.imageRatio,
          height: TABLE.height * TABLE.imageRatio
        });

        this.background.add(image);
        image.moveToBottom();

        checkDone();
      };

      tableLoader.src = 'assets/tables/' + TABLE.name + '.png';

      if (team) {
        todo++;
        const maskLoader = new Image();

        maskLoader.onload = () => {
          const image = new Konva.Image({
            x      : 0,
            y      : 0,
            image  : maskLoader,
            width  : TABLE.width * TABLE.imageRatio,
            height : TABLE.height * TABLE.imageRatio,
            opacity: 0.15
          });

          image.cache();
          image.filters([Konva.Filters.Pixelate]);
          image.pixelSize(TABLE.width * TABLE.imageRatio / maskLoader.width);

          this.background.add(image);
          image.moveToTop();

          checkDone();
        };

        maskLoader.src = 'assets/pathMasks/' + TABLE.name + '-' + team + '-' + mainRobot + '.png';
      }
    }
  }

  moveRobot(name: string, position: MapPosition) {
    if (this.robots[name] && position) {
      this.robots[name].position({
        x: position.x * TABLE.imageRatio,
        y: (TABLE.height - position.y) * TABLE.imageRatio
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
            x     : point.x * TABLE.imageRatio,
            y     : (TABLE.height - point.y) * TABLE.imageRatio,
            radius: TABLE.zoom * 4,
            fill  : 'white'
          }));
        });
      }

      if (data.collisions) {
        data.collisions.forEach((collision) => {
          switch (collision.type) {
            case 'CIRCLE':
              this.points.add(new Konva.Circle({
                x     : collision.centre.x * TABLE.imageRatio,
                y     : (TABLE.height - collision.centre.y) * TABLE.imageRatio,
                radius: collision.rayon * TABLE.imageRatio,
                fill  : 'rgba(0, 0, 0, 0.2)'
              }));

              this.points.add(new Konva.Circle({
                x     : collision.centre.x * TABLE.imageRatio,
                y     : (TABLE.height - collision.centre.y) * TABLE.imageRatio,
                radius: TABLE.zoom * 4,
                fill  : 'red'
              }));
              break;

            case 'RECTANGLE':
              this.points.add(new Konva.Rect({
                x     : collision.x * TABLE.imageRatio,
                y     : (TABLE.height - collision.y) * TABLE.imageRatio - collision.h * TABLE.imageRatio,
                width : collision.w * TABLE.imageRatio,
                height: collision.h * TABLE.imageRatio,
                fill  : 'rgba(0, 0, 0, 0.2)'
              }));

              this.points.add(new Konva.Circle({
                x     : collision.x * TABLE.imageRatio,
                y     : (TABLE.height - collision.y) * TABLE.imageRatio - collision.h * TABLE.imageRatio,
                radius: TABLE.zoom * 4,
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
                point.x * TABLE.imageRatio,
                (TABLE.height - point.y) * TABLE.imageRatio,
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
              x            : data.x * TABLE.imageRatio,
              y            : (TABLE.height - data.y) * TABLE.imageRatio,
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
              data.targetMvt.fromPoint.x * TABLE.imageRatio,
              (TABLE.height - data.targetMvt.fromPoint.y) * TABLE.imageRatio,
              data.targetMvt.toPoint.x * TABLE.imageRatio,
              (TABLE.height - data.targetMvt.toPoint.y) * TABLE.imageRatio
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

      this.state.moving = Math.abs(this.state.startX - this.state.endX) > 10 || Math.abs(this.state.startY - this.state.endY) > 10;

      if (this.state.moving) {
        this.moveDirector({
          x: this.state.startX,
          y: this.state.startY
        }, {
          x: dx,
          y: dy
        });
      } else {
        this.director.visible(false);
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
        angle: -this.director.rotation(),
      };

      this.target.visible(false);

      this.angleChanged.emit(position);

    } else {
      const position = {
        x: this.state.startX / TABLE.imageRatio / TABLE.zoom,
        y: TABLE.height - this.state.startY / TABLE.imageRatio / TABLE.zoom,
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
        x            : -ROBOT_SIZE.width / 2,
        y            : -ROBOT_SIZE.height / 2,
        image        : imageLoader,
        width        : ROBOT_SIZE.width,
        height       : ROBOT_SIZE.height,
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
      text                  : '',
      x                     : 120,
      y                     : -8,
      align                 : 'center',
      fontSize              : 16,
      fontStyle             : 'bold',
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2,
      fillAfterStrokeEnabled: true,
    }));

    return director;
  }

  private buildCrossHair() {
    const crosshair = new Konva.Group();

    crosshair.add(new Konva.Rect({
      x                     : -10,
      y                     : 0,
      width                 : 20,
      height                : 1,
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2,
      fillAfterStrokeEnabled: true,
    }));

    crosshair.add(new Konva.Rect({
      x                     : 0,
      y                     : -10,
      width                 : 1,
      height                : 20,
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2,
      fillAfterStrokeEnabled: true,
    }));

    crosshair.add(new Konva.Text({
      x                     : 5,
      y                     : 5,
      text                  : '0 : 0',
      fontSize              : 16,
      fontStyle             : 'bold',
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2,
      fillAfterStrokeEnabled: true,
    }));

    return crosshair;
  }

  moveTarget(position: Pick<MapPosition, 'x' | 'y'>) {
    if (this.target) {
      this.target.visible(true);
      this.target.position({
        x: position.x * TABLE.imageRatio,
        y: (TABLE.height - position.y) * TABLE.imageRatio
      });

      this.mainLayer.draw();
    }
  }

  moveDirector(position: Point, delta: Point) {
    if (this.director) {
      this.director.visible(true);
      this.director.position({
        x: position.x / TABLE.zoom,
        y: position.y / TABLE.zoom,
      });
      let angle = -Math.atan2(delta.y, delta.x) / Math.PI * 180;
      angle = Math.round(angle / 5) * 5;
      this.director.rotation(angle);

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
      text.text((position.x / TABLE.imageRatio / TABLE.zoom).toFixed(0) + ':' +
        (TABLE.height - position.y / TABLE.imageRatio / TABLE.zoom).toFixed(0));

      this.crosshairLayer.draw();
    }
  }
}
