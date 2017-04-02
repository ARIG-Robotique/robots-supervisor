import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot} from "@angular/router";
import {Robot} from "../models/Robot";
import {RobotsService} from "../services/robots.service";

@Injectable()
export class RobotResolve implements Resolve<Robot> {

  constructor(private robotsService:RobotsService) {
  }

  resolve(route:ActivatedRouteSnapshot) {
    return this.robotsService.getRobot(route.params['id']);
  }

}
