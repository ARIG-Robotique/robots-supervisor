import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import Konva from 'konva';
import { interval, takeUntil } from 'rxjs';
import { TABLE } from '../../../constants/constants';
import { MapPosition } from '../../../models/MapPosition';
import { Position } from '../../../models/Position';
import { Robot } from '../../../models/Robot';
import { MouvementsService } from '../../../services/mouvements.service';
import { AbstractComponent } from '../../abstract.component';
import { GameStatusManager } from './game-status.manager';

const GREEN = '#00bc8c';
const RED = '#e74c3c';

@Component({
  selector : 'arig-map-input',
  template : '<div #mapContainer class="map-container"></div>',
  styleUrls: ['./map-input.component.scss']
})
export class MapInputComponent extends AbstractComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() team: string;
  @Input() mainRobot: Robot;

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
  interactionLayer: Konva.Layer;
  crosshair: Konva.Group;
  points: Konva.Group;
  mouvement: Konva.Group;
  statusManager: GameStatusManager;

  mask: CanvasRenderingContext2D;

  constructor(private mouvementsService: MouvementsService) {
    super();
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: this.mapContainer.nativeElement,
      width    : TABLE.width * TABLE.imageRatio * TABLE.zoom,
      height   : TABLE.height * TABLE.imageRatio * TABLE.zoom,
      scaleX   : TABLE.zoom,
      scaleY   : TABLE.zoom,
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

    this.points = new Konva.Group();
    this.mainLayer.add(this.points);

    this.mouvement = new Konva.Group();
    this.mainLayer.add(this.mouvement);

    this.interactionLayer = new Konva.Layer();
    this.stage.add(this.interactionLayer);

    this.crosshair = this.buildCrossHair();
    this.interactionLayer.add(this.crosshair);

    this.target = this.buildTarget();
    this.interactionLayer.add(this.target);

    this.director = this.buildDirector();
    this.interactionLayer.add(this.director);

    this.statusManager = new GameStatusManager(this.mainLayer);

    this.setTable();

    interval(2000)
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(() => this.setMask());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team'] || changes['mainRobot']) {
      this.setMask();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.statusManager.destroy();
  }

  setPosition(name: string, main: boolean, position: Position) {
    if (this.stage) {
      this.moveRobot(name, position);

      if (main) {
        this.drawPoints(position);
        this.drawMouvement(position);

        if (this.statusManager && position?.gameStatus) {
          this.statusManager.update(position.gameStatus, this.team);
        }
      }
    }
  }

  setTable() {
    this.background.removeChildren();

    const tableLoader = new Image();

    tableLoader.onload = () => {
      const image = new Konva.Image({
        name  : 'table',
        x     : 0,
        y     : 0,
        image : tableLoader,
        width : TABLE.width * TABLE.imageRatio,
        height: TABLE.height * TABLE.imageRatio
      });

      this.background.add(image);
      image.moveToBottom();
    };

    tableLoader.src = 'assets/tables/' + TABLE.name + '.png';

    this.setMask();
  }

  setMask() {
    if (this.stage) {
      const maskLoader = new Image();

      const clear = () => {
        for (let child of this.background.children) {
          if (child.name() === 'mask') {
            child.remove();
          }
        }
      };

      maskLoader.onload = () => {
        clear();

        const image = new Konva.Image({
          name   : 'mask',
          x      : 0,
          y      : TABLE.height * TABLE.imageRatio,
          image  : maskLoader,
          width  : TABLE.width * TABLE.imageRatio,
          height : TABLE.height * TABLE.imageRatio,
          scaleY : -1,
          opacity: 0.15
        });

        image.cache();
        image.filters([Konva.Filters.Pixelate]);
        image.pixelSize(TABLE.width * TABLE.imageRatio / maskLoader.width);

        this.background.add(image);
        image.moveToTop();

        this.mask = image._cache.get('canvas').scene._canvas.getContext('2d'); // @ts-ignore
      };

      maskLoader.onerror = () => {
        clear();
        this.mask = null;
      };

      maskLoader.crossOrigin = 'anonymous';
      maskLoader.src = this.mouvementsService.getMaskUrl(this.mainRobot);
    }
  }

  moveRobot(name: string, position: MapPosition) {
    if (this.robots[name] && position) {
      this.robots[name].visible(true);
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
            radius: 4,
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
                radius: 4,
                fill  : RED
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
                radius: 4,
                fill  : RED
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
              stroke       : RED,
              fill         : RED,
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
              stroke       : RED,
              fill         : RED,
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
              stroke     : RED,
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

      this.state.moving = Math.abs(dx) > 10 || Math.abs(dy) > 10;

      if (this.state.moving) {
        this.state.angle = Math.round(Math.atan2(dy, dx) / Math.PI * 180 / 5) * 5;
        this.moveDirector();
      } else {
        this.director.visible(false);
      }
    }

    if (this.state.moving) {
      this.crosshair.visible(false);
    } else {
      this.state.position = {
        x: Math.round(this.state.endX / TABLE.imageRatio / TABLE.zoom / 5) * 5,
        y: TABLE.height - Math.round(this.state.endY / TABLE.imageRatio / TABLE.zoom / 5) * 5,
      };
      this.moveCrosshair();
    }
  }

  mouseup() {
    if (this.state.moving) {
      this.target.visible(false);

      this.angleChanged.emit({
        angle: this.state.angle,
      });

    } else {
      this.moveTarget();
      this.director.visible(false);

      this.positionChanged.emit(this.state.position);
    }

    this.state = {};
  }

  private buildRobot(name: string): Konva.Group {
    const robot = new Konva.Group({
      visible: false,
    });

    const imageLoader = new Image();

    imageLoader.onload = () => {
      robot.add(new Konva.Image({
        x            : -(TABLE.robotSize * TABLE.imageRatio) / 2,
        y            : -(TABLE.robotSize * TABLE.imageRatio) / 2,
        image        : imageLoader,
        width        : TABLE.robotSize * TABLE.imageRatio,
        height       : TABLE.robotSize * TABLE.imageRatio,
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
      stroke     : GREEN,
      strokeWidth: 2
    }));

    target.add(new Konva.Line({
      x          : -30, y: 0,
      points     : [0, 0, 60, 0],
      stroke     : GREEN,
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x          : 0, y: 0,
      radius     : 10,
      stroke     : GREEN,
      strokeWidth: 2
    }));

    target.add(new Konva.Circle({
      x          : 0, y: 0,
      radius     : 20,
      stroke     : GREEN,
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
      stroke       : GREEN,
      fill         : GREEN,
      strokeWidth  : 4,
      pointerLength: 10,
      pointerWidth : 10
    }));

    director.add(new Konva.Text({
      text                  : '0°',
      x                     : 130,
      y                     : 0,
      offsetX               : 8 / TABLE.zoom,
      offsetY               : 8 / TABLE.zoom,
      align                 : 'center',
      fontSize              : 16 / TABLE.zoom,
      fontStyle             : 'bold',
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2 / TABLE.zoom,
      fillAfterStrokeEnabled: true,
    }));

    return director;
  }

  private buildCrossHair() {
    const crosshair = new Konva.Group();

    crosshair.add(new Konva.Rect({
      x                     : -10 / TABLE.zoom,
      y                     : 0,
      width                 : 20 / TABLE.zoom,
      height                : 1 / TABLE.zoom,
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2 / TABLE.zoom,
      fillAfterStrokeEnabled: true,
    }));

    crosshair.add(new Konva.Rect({
      x                     : 0,
      y                     : -10 / TABLE.zoom,
      width                 : 1 / TABLE.zoom,
      height                : 20 / TABLE.zoom,
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2 / TABLE.zoom,
      fillAfterStrokeEnabled: true,
    }));

    crosshair.add(new Konva.Text({
      x                     : 5 / TABLE.zoom,
      y                     : 5 / TABLE.zoom,
      width                 : 100 / TABLE.zoom,
      height                : 16 / TABLE.zoom,
      text                  : '0 : 0',
      fontSize              : 16 / TABLE.zoom,
      fontStyle             : 'bold',
      fill                  : 'black',
      stroke                : 'white',
      strokeWidth           : 2 / TABLE.zoom,
      fillAfterStrokeEnabled: true,
    }));

    return crosshair;
  }

  moveTarget() {
    if (this.target) {
      this.target.visible(true);
      this.target.position({
        x: this.state.endX / TABLE.zoom,
        y: this.state.endY / TABLE.zoom
      });
    }
  }

  moveDirector() {
    if (this.director) {
      this.director.visible(true);
      this.director.position({
        x: this.state.startX / TABLE.zoom,
        y: this.state.startY / TABLE.zoom,
      });
      this.director.rotation(-this.state.angle);

      const text = this.director.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
      text.text(this.state.angle + '°');
      text.rotation(this.state.angle);
    }
  }

  moveCrosshair() {
    if (this.crosshair) {
      this.crosshair.visible(true);
      this.crosshair.position({
        x: this.state.position.x * TABLE.imageRatio,
        y: (TABLE.height - this.state.position.y) * TABLE.imageRatio,
      });

      let blocked = false;
      if (this.mask) {
        const pixel = this.mask.getImageData(this.state.position.x * TABLE.imageRatio, this.state.position.y * TABLE.imageRatio, 1, 1).data;
        blocked = pixel[0] < 127;
      }
      for (let child of this.crosshair.children) {
        (child as Konva.Shape).fill(blocked ? 'red' : 'black');
      }

      const text = this.crosshair.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
      text.text(this.state.position.x + ':' + this.state.position.y);
      if (this.state.position.x > 2800) {
        text.align('right');
        text.x(-105);
      } else {
        text.align('left');
        text.x(5);
      }
      if (this.state.position.y < 50) {
        text.verticalAlign('bottom');
        text.y(-25);
      } else {
        text.verticalAlign('top');
        text.y(5);
      }
    }
  }
}
