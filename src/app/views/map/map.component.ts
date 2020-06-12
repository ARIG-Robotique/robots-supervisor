import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { AbstractComponent } from '../../components/abstract.component';
import { SensDeplacement, SensRotation } from '../../constants/mouvements.constants';
import { Tables } from '../../constants/tables.constants';
import { Action } from '../../models/Action';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot } from '../../models/Robot';
import { CapteursService } from '../../services/capteurs.service';
import { MouvementsService } from '../../services/mouvements.service';
import { RobotsService } from '../../services/robots.service';

@Component({
  selector   : 'app-map',
  templateUrl: './map.component.html',
  styleUrls  : ['./map.component.scss']
})
export class MapComponent extends AbstractComponent implements OnInit {

  readonly Tables = Tables;
  readonly SensDeplacement = SensDeplacement;
  readonly SensRotation = SensRotation;
  readonly Modes = [
    {name: 'path', label: 'path'},
    {name: 'position', label: 'direct'}
  ];

  robot: Robot;
  team = '';

  currentTable = Tables[0];
  robotPosition: Position;
  targetPosition: MapPosition;

  form = this.fb.group({
    mode           : ['path'],
    sensDeplacement: ['AUTO'],
    sensRotation   : ['AUTO'],
  });

  trackByUuid = (action: Action) => action.uuid;
  trackByKey = (keyvalue: KeyValue<string, any>) => keyvalue.key;
  trackByIndex = (value: any, i: number) => i;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
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

    this.mouvementsService.sendMouvement(this.robot, this.form.value.mode, {
      x   : position.x,
      y   : position.y,
      sens: this.form.value.sensDeplacement,
    }).subscribe();
  }

  angleChanged(position: MapPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle,
      sens : this.form.value.sensRotation,
    }).subscribe();
  }

}
