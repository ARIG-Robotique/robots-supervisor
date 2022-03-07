import Konva from 'konva';
import { TABLE } from '../../../constants/constants';
import { COLORS, Echantillon, GameStatus } from '../../../models/sailTheWorld/GameStatus';

export class GameStatusManager {

  echantillons: Konva.Group;

  constructor(private mainLayer: Konva.Layer) {
    this.echantillons = new Konva.Group();
    this.mainLayer.add(this.echantillons);
    this.echantillons.moveToBottom();
  }

  destroy() {
    this.echantillons.destroy();
  }

  update(status: Partial<GameStatus>, team: string) {
    this.echantillons.removeChildren();

    status.echantillons?.forEach(echantillon => this.addEchantillon(echantillon));
  }

  private addEchantillon(echantillon: Echantillon) {
    this.echantillons.add(
      new Konva.RegularPolygon({
        x          : echantillon.x * TABLE.imageRatio,
        y          : (TABLE.height - echantillon.y) * TABLE.imageRatio,
        rotationDeg: echantillon.angle,
        sides      : 6,
        radius     : 75 * TABLE.imageRatio - 2,
        fill       : COLORS[echantillon.visibleColor],
        stroke     : COLORS[echantillon.color],
        strokeWidth: 4,
      })
    );
  }

}
