import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Robot} from "../models/Robot";
import {CapteursService} from "../services/capteurs.service";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-robot-info',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.scss']
})
export class CapteursComponent implements OnInit {

  robot: Robot;

  capteurs: any;

  constructor(private route: ActivatedRoute,
              private capteursService: CapteursService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];

      this.fetch();
    });

    IntervalObservable.create(1000).subscribe(() => {
      if (this.robot) {
        this.fetch();
      }
    });
  }

  fetch() {
    this.capteursService.getCapteurs(this.robot)
      .then(capteurs => this.capteurs = capteurs);
  }

}
