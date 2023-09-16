import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Position } from '../../../models/Position';
import { AbstractComponent } from '../../abstract.component';

@Component({
    selector: 'arig-map-score',
    templateUrl: 'map-score.component.html',
})
export class MapScoreComponent extends AbstractComponent {
    @Input()
    mainPosition: Position;

    trackByKey = (i: number, keyvalue: KeyValue<string, any>) => keyvalue.key;
}
