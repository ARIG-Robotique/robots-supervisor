import {Component, OnInit} from "@angular/core";
import {Robot} from "../models/Robot";
import {ActivatedRoute} from "@angular/router";
import {Mouvements} from "../constants/mouvements.constants";

@Component({
  selector: 'app-mouvements',
  templateUrl: './mouvements.component.html',
  styleUrls: ['./mouvements.component.scss']
})
export class MouvementsComponent implements OnInit {

  robot:Robot;

  Mouvements;

  constructor(private route:ActivatedRoute) {
    this.Mouvements = Mouvements;
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];
    });
  }

}
