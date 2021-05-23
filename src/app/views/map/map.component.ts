import { KeyValue } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, interval, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractComponent } from '../../components/abstract.component';
import { MapInputComponent } from '../../components/map-input/map-input.component';
import { SensDeplacement, SensRotation } from '../../constants/mouvements.constants';
import { Tables } from '../../constants/tables.constants';
import { Action } from '../../models/Action';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot, SelectedRobot } from '../../models/Robot';
import { CapteursService } from '../../services/capteurs.service';
import { MouvementsService } from '../../services/mouvements.service';
import { RobotsService } from '../../services/robots.service';
import { selectSelectedRobots } from '../../store/robots.selector';

@Component({
  templateUrl: './map.component.html',
  styleUrls  : ['./map.component.scss']
})
export class MapComponent extends AbstractComponent implements OnInit {

  readonly Tables = Tables;
  readonly SensDeplacement = SensDeplacement;
  readonly SensRotation = SensRotation;
  readonly Modes = [
    { name: 'path', label: 'path' },
    { name: 'position', label: 'direct' }
  ];

  @ViewChild(MapInputComponent)
  mapInput: MapInputComponent;

  robots$: Observable<SelectedRobot[]>;
  mainRobot$: Observable<SelectedRobot>;
  mainPosition: Position;

  team = '';

  currentTable = Tables[0];
  targetPosition: MapPosition;

  form = this.fb.group({
    mode           : ['path'],
    sensDeplacement: ['AUTO'],
    sensRotation   : ['AUTO'],
  });

  trackByUuid = (i: number, action: Action) => action.uuid;
  trackByKey = (i: number, keyvalue: KeyValue<string, any>) => keyvalue.key;
  trackByIndex = (i: number, value: any) => i;

  constructor(private fb: FormBuilder,
              private store: Store<any>,
              protected robotsService: RobotsService,
              private mouvementsService: MouvementsService,
              private capteursService: CapteursService) {
    super();
  }

  ngOnInit(): void {
    this.robots$ = this.store.select(selectSelectedRobots);
    this.mainRobot$ = this.robots$.pipe(map(robots => robots.find(r => r.main)));

    this.mainRobot$
      .pipe(
        filter(robot => !!robot),
        switchMap(robot => this.capteursService.getCapteurs(robot)),
        takeUntil(this.ngDestroy$)
      )
      .subscribe(capteurs => {
        this.team = capteurs.text.Equipe;
      });

    interval(200)
      .pipe(
        takeUntil(this.ngDestroy$),
        withLatestFrom(this.robots$),
        switchMap(([, robots]) => {
          return combineLatest(robots.map(robot => {
            return this.mouvementsService.getPosition(robot, robot.main)
              .pipe(
                catchError(() => of(null as Position)),
                map(position => ({ robot, position }))
              );
          }));
        })
      )
      .subscribe((positions) => {
        positions.forEach(({ robot, position }) => {
          this.mapInput.setPosition(robot.name.toLowerCase(), robot.main, position);
          if (robot.main) {
            this.mainPosition = position;
          }
        });
      });
  }

  positionChanged(robot: Robot, position: Pick<MapPosition, 'x' | 'y'>) {
    this.targetPosition = {
      ...this.targetPosition,
      ...position,
    };

    this.mouvementsService.sendMouvement(robot, this.form.value.mode, {
      ...position,
      sens: this.form.value.sensDeplacement,
    }).subscribe();
  }

  angleChanged(robot: Robot, position: Pick<MapPosition, 'angle'>) {
    this.targetPosition = {
      ...this.targetPosition,
      ...position,
    };

    this.mouvementsService.sendMouvement(robot, 'orientation', {
      ...position,
      sens: this.form.value.sensRotation,
    }).subscribe();
  }

}
