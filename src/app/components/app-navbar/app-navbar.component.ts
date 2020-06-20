import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Robot } from '../../models/Robot';
import { RobotInfo } from '../../models/RobotInfo';
import { RobotsUiService } from '../../services/robots-ui.service';
import { RobotsService } from '../../services/robots.service';
import { selectRobots } from '../../store/robots.selector';
import { AbstractComponent } from '../abstract.component';
import { PointsCalculatorModalComponent } from '../../modals/points-calculator-modal/points-calculator-modal.component';

@Component({
  selector   : 'arig-app-navbar',
  templateUrl: './app-navbar.component.html',
  providers  : [NgbDropdownConfig],
})
export class AppNavbarComponent extends AbstractComponent implements OnInit {

  robots$: Observable<Robot[]>;
  selectedRobot: Robot;
  selectedRobotInfo: RobotInfo;

  constructor(private store: Store<any>,
              private route: ActivatedRoute,
              private router: Router,
              private modal: NgbModal,
              private robotsService: RobotsService,
              private robotsUiService: RobotsUiService) {
    super();
  }

  ngOnInit() {
    this.robots$ = this.store.select(selectRobots);

    combineLatest([
      this.router.events
        .pipe(
          filter(e => e instanceof NavigationEnd),
          map(() => {
            let params = {};
            let route = this.route.root;
            do {
              params = {...params, ...route.snapshot.params};
              route = route.firstChild;
            } while (route);
            return params;
          }),
          map(params => +params['idRobot'])
        ),
      this.robots$
    ])
      .pipe(
        map(([idRobot, robots]) => robots.find(r => r.id === idRobot)),
        switchMap(robot => {
          this.selectedRobot = robot;
          if (robot) {
            return this.robotsService.getRobotInfo(robot);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(infos => this.selectedRobotInfo = infos);
  }

  importLogs(robot: Robot) {
    this.robotsUiService.importLogs(robot);
  }

  openCalculator() {
    this.modal.open(PointsCalculatorModalComponent, {size: 'lg'});
  }

}
