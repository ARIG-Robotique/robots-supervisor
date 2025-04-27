import { Point } from 'app/models/Point';
import Konva from 'konva';
import { TABLE } from '../../../constants/constants';
import {GameStatus, Team, } from '../../../models/showMustGoOn/GameStatus';

export class GameStatusManager {

    constructor(private mainLayer: Konva.Layer) {

    }

    destroy() {

    }

    update(status: Partial<GameStatus>, team: Team) {

    }
}
