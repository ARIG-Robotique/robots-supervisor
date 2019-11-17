import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Observable, of} from 'rxjs';
import {AbstractComponent} from '../abstract.component';
import {Store} from '@ngrx/store';
import {selectRobots} from '../../store/robots.selector';
import {Robot} from '../../models/Robot';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {RobotInfo} from '../../models/RobotInfo';
import {filter, map, switchMap} from 'rxjs/operators';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector   : 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.scss'],
  providers  : [NgbDropdownConfig],
})
export class NavbarComponent extends AbstractComponent implements OnInit {

  robots$: Observable<Robot[]>;
  selectedRobot: RobotInfo;

  constructor(private store: Store<any>,
              private route: ActivatedRoute,
              private router: Router,
              private robotsService: RobotsService) {
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
          if (robot) {
            return this.robotsService.getRobotInfo(robot);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(infos => this.selectedRobot = infos);
  }

}
