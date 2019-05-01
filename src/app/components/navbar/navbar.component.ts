import {Component, OnDestroy, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig] // add NgbDropdownConfig to the component providers
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'Robots supervisor';
  robots: Robot[];
  selectedRobot: Robot[] = [];

  robotsSubscription: Subscription;

  constructor(config: NgbDropdownConfig,
              private robotsService: RobotsService,
              private toastService: ToastrService) {
    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() {
    this.getRobots();
  }

  getRobots() {
    this.robotsSubscription = this.robotsService.getRobotObservable()
      .subscribe((robots: Robot[]) => {
        this.robots = robots;

        if (robots && robots.length === 1) {
          robots[0].checked = true;
          this.selectRobot(robots[0]);
        }
      });

    this.robotsService.getRobots();
  }

  selectRobot(robot: Robot) {
    if (robot.checked) {
      if (this.selectedRobot.length > 2) {
        this.selectedRobot[0].checked = false;
        this.selectedRobot.shift();
      }
      this.selectedRobot.push(robot);
    } else {
      this.selectedRobot = this.selectedRobot.filter(r => r.checked);
    }

    this.robotsService.notifySelectedRobot(this.selectedRobot);
  }

  copyLogs(robot: Robot) {
    this.robotsService.copyLogs(robot.id)
      .subscribe(() => {
        this.toastService.success('Les logs sont copiés!');
      }, () => {
        this.toastService.error('Erreur lors de copie des logs');
      });
  }

  importLogs(robot: Robot) {
    this.robotsService.importLogs(robot.id)
      .subscribe(() => {
        this.toastService.success('Les logs sont importés');
      }, () => {
        this.toastService.error('Erreur lors de l\'import des logs');
      });
  }

  ngOnDestroy(): void {
    if (this.robotsSubscription) {
      this.robotsSubscription.unsubscribe();
      this.robotsSubscription = null;
    }
  }
}
