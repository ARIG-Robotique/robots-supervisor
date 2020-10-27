import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractComponent implements OnDestroy {

  protected ngDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
