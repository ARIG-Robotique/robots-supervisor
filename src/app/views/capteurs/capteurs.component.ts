import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../../models/Robot';
import {CapteursService} from '../../services/capteurs.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Subscription} from 'rxjs/Rx';
import {CodeursService} from '../../services/codeurs.service';
import {RobotsService} from "../../services/robots.service";

@Component({
  selector: 'app-robot-capteur',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.scss']
})
export class CapteursComponent implements OnInit, OnDestroy {

  robots: Robot[];

  capteurs: any;
  codeurs: any;

  subs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private robotsService: RobotsService,
              private capteursService: CapteursService,
              private codeursService: CodeursService) {
  }

  ngOnInit() {
    this.robotsService.getNotifySelectedRobotObservable()
      .subscribe((robots: Robot[]) => {
        if (robots !== null) {
          this.robots = robots;
          this.robots.forEach((robot: Robot) => {
            this.fetch(robot);
            this.subs.push(IntervalObservable.create(1000).subscribe(() => {
              this.fetch(robot);
            }));
          });
        }
      });
    // this.route.parent.data.subscribe(data => {
    //   this.robot = data['robot'];
    //
    //   this.fetch();
    // });

    // this.sub = IntervalObservable.create(1000).subscribe(() => {
    //   if (this.robot) {
    //     this.fetch();
    //   }
    // });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  fetch(robot: Robot) {
    this.capteursService.getCapteurs(robot)
      .subscribe(capteurs => robot.capteurs = capteurs);

    // this.codeursService.getCodeurs(this.robot)
    //   .then(codeurs => this.codeurs = codeurs);
  }

  setTirette(present: boolean) {
    // this.capteursService.setTirette(this.robot, present)
    //   .subscribe((result) => {
    //     this.capteurs.numerique.Tirette = result;
    //   });
  }

  setTeam(team: string) {
    // this.capteursService.setTeam(this.robot, team)
    //   .subscribe((result) => {
    //     this.capteurs.text.Equipe = result;
    //   });
  }

  setAu(present: boolean) {
    // this.capteursService.setAu(this.robot, present)
    //   .subscribe((result) => {
    //     this.capteurs.numerique.AU = result;
    //   });
  }

}
