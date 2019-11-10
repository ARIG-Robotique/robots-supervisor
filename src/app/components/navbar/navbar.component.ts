import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {AbstractComponent} from '../abstract.component';
import {Store} from '@ngrx/store';
import {selectRobots} from '../../store/robots.selector';
import {Robot} from '../../models/Robot';

@Component({
  selector   : 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.scss'],
  providers  : [NgbDropdownConfig],
})
export class NavbarComponent extends AbstractComponent implements OnInit {

  robots$: Observable<Robot[]>;

  constructor(private store: Store<any>) {
    super();
  }

  ngOnInit() {
    this.robots$ = this.store.select(selectRobots);
  }

}
