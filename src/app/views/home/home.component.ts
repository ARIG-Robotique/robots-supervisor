import {Component, OnInit} from '@angular/core';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private robotsService: RobotsService) {
  }

  ngOnInit() {
  }

}
