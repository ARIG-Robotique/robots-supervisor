import { Component, Input } from '@angular/core';
import { Capteurs } from '../../models/Capteurs';

@Component({
  selector   : 'app-capteurs',
  templateUrl: './capteurs.component.html',
})
export class CapteursComponent {

  @Input() capteurs: Capteurs;

}
