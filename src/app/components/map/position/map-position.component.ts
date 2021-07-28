import { Component, Input } from '@angular/core';
import { SensDeplacement, SensRotation } from '../../../constants/mouvements.constants';
import { MapPosition } from '../../../models/MapPosition';
import { AbstractComponent } from '../../abstract.component';

@Component({
  selector   : 'arig-map-position',
  templateUrl: 'map-position.component.html',
})
export class MapPositionComponent extends AbstractComponent {

  readonly SensDeplacement = SensDeplacement;
  readonly SensRotation = SensRotation;
  readonly Modes = [
    { name: 'path', label: 'path' },
    { name: 'position', label: 'direct' }
  ];

  @Input()
  mainPosition: MapPosition;

  @Input()
  targetPosition: MapPosition;

  @Input()
  config: any;

}
