import { Component, Input } from '@angular/core';
import { Position } from '../../../models/Position';
import { AbstractComponent } from '../../abstract.component';
import { CouleurPanneauSolaire, PanneauSolaire } from '../../../models/farmingMars/GameStatus';

@Component({
    selector: 'arig-map-info',
    templateUrl: 'map-info.component.html',
    styleUrls: ['map-info.component.scss'],
})
export class MapInfoComponent extends AbstractComponent {
    @Input()
    team = '';

    @Input()
    mainPosition: Position;

    trackByIndex = (i: number, value: any) => i;

    panneauIsBleu(panneau: PanneauSolaire) {
        return [
            CouleurPanneauSolaire.BLEU,
            CouleurPanneauSolaire.WIP_BLEU,
            CouleurPanneauSolaire.JAUNE_ET_BLEU,
        ].includes(panneau.color);
    }

    panneauIsJaune(panneau: PanneauSolaire) {
        return [
            CouleurPanneauSolaire.JAUNE,
            CouleurPanneauSolaire.WIP_JAUNE,
            CouleurPanneauSolaire.JAUNE_ET_BLEU,
        ].includes(panneau.color);
    }
}
