import { KeyValue, NgFor, DecimalPipe, TitleCasePipe, KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Position } from '../../../models/Position';
import { AbstractComponent } from '../../abstract.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'arig-map-score',
    templateUrl: 'map-score.component.html',
    imports: [FaIconComponent, NgFor, DecimalPipe, TitleCasePipe, KeyValuePipe],
})
export class MapScoreComponent extends AbstractComponent {
    @Input()
    mainPosition: Position;

    trackByKey = (i: number, keyvalue: KeyValue<string, any>) => keyvalue.key;
}
