import Konva from 'konva';
import { TABLE } from '../../../constants/constants';
import { COLORS_ECHANTILLON, Echantillon, GameStatus } from '../../../models/ageOfBots/GameStatus';

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
    this.echantillons.destroyChildren();

    status.echantillons?.forEach(echantillon => this.addEchantillon(echantillon));
  }

  private addEchantillon(echantillon: Echantillon) {
    this.echantillons.add(
      new Konva.RegularPolygon({
        x          : echantillon.x * TABLE.imageRatio,
        y          : (TABLE.height - echantillon.y) * TABLE.imageRatio,
        sides      : 6,
        radius     : 75 * TABLE.imageRatio - 2,
        fill       : COLORS_ECHANTILLON[echantillon.couleur],
        stroke     : COLORS_ECHANTILLON[echantillon.couleur.replace('ROCHER_', '')],
        strokeWidth: 4,
      })
    );
  }

}
