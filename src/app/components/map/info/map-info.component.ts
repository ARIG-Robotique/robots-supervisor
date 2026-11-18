import { Component, Input } from '@angular/core';
import { Position } from '../../../models/Position';
import { AbstractComponent } from '../../abstract.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgClass, NgTemplateOutlet, NgIf, DecimalPipe, KeyValuePipe } from '@angular/common';

@Component({
    selector: 'arig-map-info',
    templateUrl: 'map-info.component.html',
    styleUrls: ['map-info.component.scss'],
    imports: [FaIconComponent, NgFor, NgClass, NgTemplateOutlet, NgIf, DecimalPipe, KeyValuePipe],
})
export class MapInfoComponent extends AbstractComponent {
    @Input()
    team = '';

    @Input()
    mainPosition: Position;

    trackByIndex = (i: number, value: any) => i;
}
