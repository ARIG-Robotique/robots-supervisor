import {Injectable} from "@angular/core";
import {Robot} from "./models/robot";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Servo} from "./models/Servo";

@Injectable()
export class RobotsService {

  private robots:Robot[];

  constructor(private http:Http) {
    let robots = localStorage.getItem('robots');
    if (robots) {
      this.robots = JSON.parse(robots);
    }
    else {
      this.robots = [];
    }
  }

  getRobot(id:any):Promise<Robot> {
    return Promise.resolve(this.robots.find((robot:Robot) => robot.id === id));
  }

  getRobots():Promise<Robot[]> {
    return Promise.resolve(this.robots);
  }

  addRobot(robot:Robot):Promise<Robot> {
    this.robots.push(robot);
    localStorage.setItem('robots', JSON.stringify(this.robots));

    return Promise.resolve(robot);
  }

  getRobotInfo(robot:Robot):Promise<Robot> {
    return this.http.get(`http://${robot.host}/robot`)
      .toPromise()
      .then((response:Response) => {
        return response.json();
      });
  }

  getRobotServos(robot:Robot):Promise<Servo[]> {
    return this.http.get(`http://${robot.host}/servos`)
      .toPromise()
      .then((response:Response) => {
        return response.json().map((servo: Servo) => {
          servo.minPosition = servo.minPosition || 500; // FIXME
          servo.maxPosition = servo.maxPosition || 2500;
          servo.minSpeed = 0;
          servo.maxSpeed = 50;
          return servo;
        });
      });
  }
}
