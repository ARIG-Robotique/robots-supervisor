import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RobotsService} from '../../services/robots.service';
import {RobotTabComponent} from '../robot/robotTab.component';
import {Observable} from 'rxjs';
import {RobotInfo} from '../../models/RobotInfo';
import {switchMap} from 'rxjs/operators';

@Component({
  selector   : 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrls  : ['./robot-info.component.scss']
})
export class RobotInfoComponent extends RobotTabComponent implements OnInit {

  robotInfos$: Observable<RobotInfo>;

  constructor(route: ActivatedRoute,
              private robotsService: RobotsService) {
    super(route);
  }

  ngOnInit(): void {
    this.robotInfos$ = this.robotsService.getRobotInfo(this.robot);
  }

}
