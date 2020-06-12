import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Capteurs } from '../../models/Capteurs';

@Component({
  selector   : 'app-capteurs',
  templateUrl: './capteurs.component.html',
})
export class CapteursComponent {

  @Input() capteurs: Capteurs;

  trackByKey = (keyvalue: KeyValue<string, any>) => keyvalue.key;

}
