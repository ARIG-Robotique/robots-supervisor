import {Component, OnInit, ViewChild} from '@angular/core';
import {RobotsService} from '../../services/robots.service';
import {Tables} from '../../constants/tables.constants';
import {CapteursService} from '../../services/capteurs.service';
import {MouvementsService} from '../../services/mouvements.service';
import {MapInputComponent} from '../../components/map-input/map-input.component';
import {Position} from '../../models/Position';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {MapPosition} from '../../models/MapPosition';
import {Robot} from '../../models/Robot';
import {AbstractComponent} from '../../components/abstract.component';

@Component({
  selector   : 'app-map',
  templateUrl: './map.component.html',
  styleUrls  : ['./map.component.scss']
})
export class MapComponent extends AbstractComponent implements OnInit {

  robot: Robot;

  @ViewChild(MapInputComponent, {static: false}) mapinputComponent: MapInputComponent;

  Tables = Tables;
  currentTable = Tables[0];

  team: string;
  robotPosition: Position;

  targetPosition: MapPosition;

  Modes: any = [
    {name: 'path', label: 'path'},
    {name: 'position', label: 'direct'}
  ];

  Zooms: any = [
    {level: 0.5, label: '50%'},
    {level: 0.75, label: '75%'},
    {level: 1.0, label: '100%'}
  ];

  currentMode = 'path';
  currentZoom = 0.75;

  constructor(private route: ActivatedRoute,
              protected robotsService: RobotsService,
              private mouvementsService: MouvementsService,
              private capteursService: CapteursService) {
    super();
    this.robot = this.route.snapshot.data['robot'];
  }

  ngOnInit(): void {
    this.capteursService.getCapteurs(this.robot)
      .subscribe(capteurs => {
        this.team = capteurs.text.Equipe;
      });

    interval(200)
      .pipe(
        takeUntil(this.ngDestroy$),
        switchMap(() => this.mouvementsService.getPosition(this.robot))
      )
      .subscribe({
        next : position => this.robotPosition = position,
        error: () => this.robotPosition = null,
      });
  }

  positionChanged(position: MapPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
      x: position.x,
      y: position.y
    }).subscribe();
  }

  angleChanged(position: MapPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle
    }).subscribe();
  }

  onTableChange(newTable) {
    this.currentTable = Tables.filter(table => table.name === newTable)[0];
  }
}
