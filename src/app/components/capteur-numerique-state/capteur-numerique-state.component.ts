import {Component, Input} from '@angular/core';

@Component({
  selector   : 'app-capteur-numerique-state',
  templateUrl: './capteur-numerique-state.component.html',
  styleUrls  : ['./capteur-numerique-state.component.scss']
})
export class CapteurNumeriqueStateComponent {

  @Input() name: string;
  @Input() state: boolean;

}
