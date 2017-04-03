import {Component, OnInit} from "@angular/core";
import {Tables} from "../constants/tables.constants";
import {Table} from "../models/Table";
import {MouvementsService} from "../services/mouvements.service";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import {Robot} from "../models/Robot";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mouvement-map',
  templateUrl: './mouvement-map.component.html',
  styleUrls: ['./mouvement-map.component.scss']
})
export class MouvementMapComponent implements OnInit {

  Tables:Table[];
  currentTable:Table;

  robot:Robot;
  robotPosition:Position;

  constructor(private route:ActivatedRoute,
              private mouvementsService:MouvementsService) {
  }

  ngOnInit() {
    this.Tables = Tables;
    this.currentTable = Tables[0];

    this.route.parent.data.subscribe(data => {
      this.robot = data['robot'];
    });

    IntervalObservable.create(1000).subscribe(() => {
      this.mouvementsService.getPosition(this.robot)
        .then((position:Position) => this.robotPosition = position);
    });
  }

}
