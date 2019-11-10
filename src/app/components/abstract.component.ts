import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';

export abstract class AbstractComponent implements OnDestroy {

  protected ngDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
