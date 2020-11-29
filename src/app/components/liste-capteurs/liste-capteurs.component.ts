import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Capteurs } from '../../models/Capteurs';

@Component({
  selector   : 'arig-liste-capteurs',
  templateUrl: './liste-capteurs.component.html',
})
export class ListeCapteursComponent {

  @Input() capteurs: Capteurs;

  trackByKey = (i: number, keyvalue: KeyValue<string, any>) => keyvalue.key;

}
