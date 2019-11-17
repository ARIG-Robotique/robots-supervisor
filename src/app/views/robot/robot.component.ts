import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {RobotInfo} from '../../models/RobotInfo';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent implements OnInit {

  robotInfos$: Observable<RobotInfo>;

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService) {
  }

  ngOnInit(): void {
    this.robotInfos$ = this.robotsService.getRobotInfo(this.route.snapshot.data['robot']);
  }

}
