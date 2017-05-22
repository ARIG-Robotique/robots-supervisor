import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Robot} from '../models/Robot';
import {CapteursService} from '../services/capteurs.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Subscription} from 'rxjs/Rx';
import {CodeursService} from '../services/codeurs.service';

@Component({
  selector: 'app-robot-info',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.scss']
})
export class CapteursComponent implements OnInit, OnDestroy {

  robot: Robot;

  capteurs: any;
  codeurs: any;

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private capteursService: CapteursService,
              private codeursService: CodeursService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.fetch();
    });

    this.sub = IntervalObservable.create(1000).subscribe(() => {
      if (this.robot) {
        this.fetch();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetch() {
    this.capteursService.getCapteurs(this.robot)
      .then(capteurs => this.capteurs = capteurs);

    // this.codeursService.getCodeurs(this.robot)
    //   .then(codeurs => this.codeurs = codeurs);
  }

  setTirette(present: boolean) {
    this.capteursService.setTirette(this.robot, present)
      .then((result) => {
        this.capteurs.numerique.Tirette = result;
      });
  }

  setTeam(team: string) {
    this.capteursService.setTeam(this.robot, team)
      .then((result) => {
        this.capteurs.text.Equipe = result;
      });
  }

  setAu(present: boolean) {
    this.capteursService.setAu(this.robot, present)
      .then((result) => {
        this.capteurs.numerique.AU = result;
      });
  }

}
