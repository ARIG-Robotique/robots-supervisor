import {Component, OnInit} from '@angular/core';
import {RobotsService} from '../../services/robots.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  echo: string;

  constructor(private robotsService: RobotsService) {
  }

  ngOnInit() {
    this.robotsService.echo('test')
      .subscribe((response: string) => this.echo = response);
  }

}
