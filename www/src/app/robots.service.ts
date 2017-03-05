import {Injectable} from "@angular/core";
import {Robot} from "./models/robot";
import {Http, Response} from "@angular/http";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RobotsService {

  private robots: Robot[];

  constructor(private http: Http) {
    let robots = localStorage.getItem('robots');
    if (robots) {
      this.robots = JSON.parse(robots);
    }
    else {
      this.robots = [];
    }
  }

  getRobots(): Promise<Robot[]> {
    return Promise.resolve(this.robots);
  }

  addRobot(robot: Robot): Promise<Robot> {
    this.robots.push(robot);
    localStorage.setItem('robots', JSON.stringify(this.robots));

    return Promise.resolve(robot);
  }

  getRobotInfo(robot: Robot): Promise<Robot> {
    return this.http.get(`http://${robot.host}/robot`)
      .toPromise()
      .then((response: Response) => {
        return response.json().data;
      });
  }
}
