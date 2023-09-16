import { Component, Input } from '@angular/core';
import { Action } from '../../../models/Action';
import { Position } from '../../../models/Position';
import { Robot, SelectedRobot } from '../../../models/Robot';
import { StrategyService } from '../../../services/strategy.service';
import { AbstractComponent } from '../../abstract.component';

@Component({
    selector: 'arig-map-actions',
    templateUrl: 'map-actions.component.html',
})
export class MapActionsComponent extends AbstractComponent {
    @Input()
    mainRobot: SelectedRobot;

    @Input()
    mainPosition: Position;

    trackByUuid = (i: number, action: Action) => action.uuid;

    constructor(private strategyService: StrategyService) {
        super();
    }

    executeAction(robot: Robot, action: Action) {
        this.strategyService.execute(robot, action.uuid).subscribe();
    }
}
