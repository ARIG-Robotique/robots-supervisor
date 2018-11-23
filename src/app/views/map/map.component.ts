import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tables} from '../../constants/tables.constants';
import {Table} from '../../models/Table';
import {Robot} from '../../models/Robot';
import {RobotPosition} from '../../models/RobotPosition';
import {ActivatedRoute} from '@angular/router';
import {MouvementsService} from '../../services/mouvements.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Subscription} from 'rxjs/Rx';
import {CapteursService} from '../../services/capteurs.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  Tables: Table[];
  currentTable: Table;

  robot: Robot;
  team: string;
  robotPosition: RobotPosition;

  targetPosition: RobotPosition;

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
  currentZoom = 1.0;

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private capteursService: CapteursService,
              private mouvementsService: MouvementsService) {
  }

  ngOnInit() {
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.capteursService.getCapteurs(this.robot)
        .subscribe((capteurs) => {
          // this.team = capteurs.text.Equipe;
        });

      this.fetch();
    });

    this.sub = IntervalObservable.create(200).subscribe(() => {
      if (this.robot) {
        this.fetch();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetch() {
    this.mouvementsService.getPosition(this.robot)
      .subscribe((position: RobotPosition) => this.robotPosition = position);
  }

  positionChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, this.currentMode, {
      x: position.x,
      y: position.y
    });
  }

  angleChanged(position: RobotPosition) {
    this.targetPosition = position;

    this.mouvementsService.sendMouvement(this.robot, 'orientation', {
      angle: position.angle
    });
  }

}
