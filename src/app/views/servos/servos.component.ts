import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServosService} from '../../services/servos.service';
import {RobotTabComponent} from '../robot/robotTab.component';
import {Observable} from 'rxjs';
import {ServoGroup} from '../../models/Servo';
import {map} from 'rxjs/operators';

@Component({
  selector   : 'app-servos',
  templateUrl: './servos.component.html',
  styleUrls  : ['./servos.component.scss']
})
export class ServosComponent extends RobotTabComponent implements OnInit {

  servos$: Observable<ServoGroup[]>;

  constructor(route: ActivatedRoute,
              private servosService: ServosService) {
    super(route);
  }

  ngOnInit(): void {
    this.servos$ = this.servosService.getServos(this.robot)
      .pipe(
        map(servos => {
          return Object.keys(servos).map(name => ({
            name,
            servos: servos[name],
          }))
        })
      );
  }

}
