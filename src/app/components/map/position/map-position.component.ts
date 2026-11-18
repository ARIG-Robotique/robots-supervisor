import { Component, Input } from '@angular/core';
import { SensDeplacement, SensRotation } from '../../../constants/mouvements.constants';
import { MapPosition } from '../../../models/MapPosition';
import { AbstractComponent } from '../../abstract.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgTemplateOutlet, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'arig-map-position',
    templateUrl: 'map-position.component.html',
    imports: [FaIconComponent, NgTemplateOutlet, FormsModule, NgFor, DecimalPipe],
})
export class MapPositionComponent extends AbstractComponent {
    readonly SensDeplacement = SensDeplacement;
    readonly SensRotation = SensRotation;
    readonly Modes = [
        { name: 'path', label: 'path' },
        { name: 'position', label: 'direct' },
    ];

    @Input()
    mainPosition: MapPosition;

    @Input()
    targetPosition: MapPosition;

    @Input()
    config: any;
}
