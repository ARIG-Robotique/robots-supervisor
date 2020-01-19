import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Robot} from '../models/Robot';
import {RobotsService} from '../services/robots.service';

@Injectable()
export class RobotResolve implements Resolve<Robot> {

  constructor(private robotsService: RobotsService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.robotsService.getRobot(route.params['idRobot']);
  }

}
