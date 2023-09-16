import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class AbstractComponent implements OnDestroy {
    protected ngDestroy$ = new Subject<void>();

    ngOnDestroy() {
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
