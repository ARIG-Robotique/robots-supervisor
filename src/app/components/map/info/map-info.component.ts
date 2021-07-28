import { Component, Input } from '@angular/core';
import { Position } from '../../../models/Position';
import { AbstractComponent } from '../../abstract.component';

@Component({
  selector   : 'arig-map-info',
  templateUrl: 'map-info.component.html',
  styleUrls  : ['map-info.component.scss'],
})
export class MapInfoComponent extends AbstractComponent {

  @Input()
  team = '';

  @Input()
  mainPosition: Position;

  trackByIndex = (i: number, value: any) => i;

}
