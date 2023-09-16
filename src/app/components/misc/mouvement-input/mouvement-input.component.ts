import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Robot } from '../../../models/Robot';
import { MouvementsService } from '../../../services/mouvements.service';

@Component({
    selector: 'arig-mouvement-input',
    templateUrl: './mouvement-input.component.html',
    styleUrls: ['./mouvement-input.component.scss'],
})
export class MouvementInputComponent implements OnInit {
    @Input() robot: Robot;
    @Input() type: string;
    @Input() icon: IconProp;
    @Input() name: string;
    @Input() fields: string[];
    @Input() select: Record<string, string[]>;
    @Input() values: Record<string, string>;

    constructor(private mouvementsService: MouvementsService) {}

    ngOnInit() {
        if (!this.values) {
            this.values = {};
        }
    }

    apply() {
        this.mouvementsService.sendMouvement(this.robot, this.type, this.values).subscribe();
    }
}
