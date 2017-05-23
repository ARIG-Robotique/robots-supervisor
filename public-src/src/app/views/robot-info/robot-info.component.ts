import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrls: ['./robot-info.component.scss']
})
export class RobotInfoComponent implements OnInit {

  robot: Robot;

  robotInfo: any;

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.robotsService.getRobotInfo(this.robot)
        .then(info => this.robotInfo = info);
    });
  }

}
