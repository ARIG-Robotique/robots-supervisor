import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {Robot} from "../models/Robot";

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent implements OnInit {

  robot:Robot;

  constructor(private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.robot = data['robot'];
    })
  }

  refresh() {
    alert('TODO');
  }

}
