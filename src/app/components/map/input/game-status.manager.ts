import Konva from 'konva';
import { GameStatus } from '../../../models/sailTheWorld/GameStatus';

export class GameStatusManager {

  constructor(private mainLayer: Konva.Layer) {
  }

  destroy() {
  }

  update(status: Partial<GameStatus>, team: string) {
  }

}
