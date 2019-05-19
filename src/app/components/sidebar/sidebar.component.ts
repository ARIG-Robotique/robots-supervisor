import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [RobotsService]
})
export class SidebarComponent implements OnInit {

  @Input()
  robot: Robot;

  @Output()
  actionRobot: EventEmitter<any> = new EventEmitter();

  constructor(private robotsService: RobotsService) {
  }

  ngOnInit() {
  }

  addRobot() {
    if (this.robot.id) {
      this.robotsService.modifyRobot(this.robot)
        .subscribe((robot: Robot) => {
          this.actionRobot.emit({
            action: 'add',
            data: robot
          });
        });
    } else {
      this.robotsService.addRobot(this.robot)
        .subscribe((robot: Robot) => {
          this.actionRobot.emit({
            action: 'add',
            data: robot
          });
        });
    }
  }

  editableLogDir(robot: Robot) {

    const editable = !(robot.simulateur && environment.production);
    if (!editable) {
      robot.dir = '/logs/simulateur';
    }

    return editable;
  }
}
