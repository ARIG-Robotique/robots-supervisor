import {Component, OnInit} from '@angular/core';
import {RobotsService} from '../../services/robots.service';
import {Tables} from '../../constants/tables.constants';
import {CapteursService} from '../../services/capteurs.service';
import {MouvementsService} from '../../services/mouvements.service';
import {Position} from '../../models/Position';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs';
import {catchError, switchMap, takeUntil} from 'rxjs/operators';
import {MapPosition} from '../../models/MapPosition';
import {Robot} from '../../models/Robot';
import {AbstractComponent} from '../../components/abstract.component';

@Component({
  selector   : 'app-map',
  templateUrl: './map.component.html',
  styleUrls  : ['./map.component.scss']
})
export class MapComponent extends AbstractComponent implements OnInit {

  Tables = Tables;

  Modes: any = [
    {name: 'path', label: 'path'},
    {name: 'position', label: 'direct'}
  ];

  robot: Robot;
  team = '';

  currentMode = 'path';
  currentTable = Tables[0];
  robotPosition: Position;
  targetPosition: MapPosition;

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
        switchMap(() => this.mouvementsService.getPosition(this.robot)),
        catchError(() => null)
      )
      .subscribe(position => this.robotPosition = position as Position);
  }

  positionChanged(position: MapPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
      x: position.x,
      y: position.y,
    }).subscribe();
  }

  angleChanged(position: MapPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle,
    }).subscribe();
  }

}
