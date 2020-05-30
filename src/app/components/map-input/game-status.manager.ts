import Konva from 'konva';
import { ECouleurBouee } from '../../models/sailTheWorld/ECouleurBouee';
import { GameStatus } from '../../models/sailTheWorld/GameStatus';
import { Table } from '../../models/Table';

export class GameStatusManager {

  readonly DIAMETRE_GOBELET = 72;

  readonly POS_BOUEES: Array<[number, number, ECouleurBouee]> = [
    [300, 2000 - 400, ECouleurBouee.ROUGE],
    [450, 2000 - 510, ECouleurBouee.VERT],
    [450, 2000 - 1080, ECouleurBouee.ROUGE],
    [300, 2000 - 1200, ECouleurBouee.VERT],
    [670, 2000 - 100, ECouleurBouee.ROUGE],
    [950, 2000 - 400, ECouleurBouee.VERT],
    [1100, 2000 - 800, ECouleurBouee.ROUGE],
    [1270, 2000 - 1200, ECouleurBouee.VERT],
    [1730, 2000 - 1200, ECouleurBouee.ROUGE],
    [1900, 2000 - 800, ECouleurBouee.VERT],
    [2050, 2000 - 400, ECouleurBouee.ROUGE],
    [2330, 2000 - 100, ECouleurBouee.VERT],
    [2700, 2000 - 400, ECouleurBouee.VERT],
    [2550, 2000 - 510, ECouleurBouee.ROUGE],
    [2550, 2000 - 1080, ECouleurBouee.VERT],
    [2700, 2000 - 1200, ECouleurBouee.ROUGE],
  ];

  readonly GRAND_CHENAL_VERT_Y = {
    'JAUNE': 2000 - 510,
    'BLEU' : 2000 - 1100,
  };
  readonly GRAND_CHENAL_ROUGE_Y = {
    'JAUNE': 2000 - 1100,
    'BLEU' : 2000 - 510,
  };
  readonly GRAND_PORT_Y = {
    'JAUNE': 2000 - 800,
    'BLEU' : 2000 - 800,
  };

  readonly PETIT_CHENAL_VERT_X = {
    'JAUNE': 1075,
    'BLEU' : 1675,
  };
  readonly PETIT_CHENAL_ROUGE_X = {
    'JAUNE': 1325,
    'BLEU' : 1925,
  };
  readonly PETIT_PORT_X = {
    'JAUNE': 1200,
    'BLEU' : 1800,
  };

  bouees: Konva.Group;
  grandChenalRouge: Konva.Group;
  grandChenalVert: Konva.Group;
  grandPort: Konva.Group;
  petitChenalRouge: Konva.Group;
  petitChenalVert: Konva.Group;
  petitPort: Konva.Group;

  constructor(private mainLayer: Konva.Layer, private table: Table) {
    this.bouees = new Konva.Group();
    this.grandChenalRouge = new Konva.Group();
    this.grandChenalVert = new Konva.Group();
    this.grandPort = new Konva.Group();
    this.petitChenalRouge = new Konva.Group();
    this.petitChenalVert = new Konva.Group();
    this.petitPort = new Konva.Group();

    this.mainLayer.add(this.bouees);
    this.mainLayer.add(this.grandChenalRouge);
    this.mainLayer.add(this.grandChenalVert);
    this.mainLayer.add(this.grandPort);
    this.mainLayer.add(this.petitChenalRouge);
    this.mainLayer.add(this.petitChenalVert);
    this.mainLayer.add(this.petitPort);

    this.POS_BOUEES.forEach(posBouee => {
      this.bouees.add(this.createBouee(posBouee[0], posBouee[1], posBouee[2]));
    });
  }

  destroy() {
    this.bouees.destroy();
    this.grandChenalRouge.destroy();
    this.grandChenalVert.destroy();
    this.grandPort.destroy();
    this.petitChenalRouge.destroy();
    this.petitChenalVert.destroy();
    this.petitPort.destroy();
  }

  update(status: GameStatus, team: string) {
    status.bouees.forEach((bouee, i) => {
      if (bouee) {
        this.bouees.children[i].opacity(0);
      }
    });

    this.fillRow(this.grandChenalRouge, status.grandChenalRouge, this.GRAND_CHENAL_ROUGE_Y, team);
    this.fillRow(this.grandChenalVert, status.grandChenalVert, this.GRAND_CHENAL_VERT_Y, team);
    this.fillRow(this.grandPort, status.grandPort, this.GRAND_PORT_Y, team);
    this.fillDoubleCol(this.petitChenalRouge, status.petitChenalRouge, this.PETIT_CHENAL_ROUGE_X, team);
    this.fillDoubleCol(this.petitChenalVert, status.petitChenalVert, this.PETIT_CHENAL_VERT_X, team);
    this.fillCol(this.petitPort, status.petitPort, this.PETIT_PORT_X, team);
  }

  private createBouee(x: number, y: number, couleur: ECouleurBouee) {
    return new Konva.Circle({
      x     : x * this.table.imageRatio,
      y     : (this.table.height - y) * this.table.imageRatio,
      radius: this.DIAMETRE_GOBELET * this.table.imageRatio / 2,
      fill  : couleur === ECouleurBouee.ROUGE ? '#d7171f' : couleur === ECouleurBouee.VERT ? '#007a45' : '#555555',
      stroke: 'white',
      strokeWidth: 2,
    });
  }

  private fillRow(group: Konva.Group, bouees: ECouleurBouee[], Y: { JAUNE: number; BLEU: number }, team: string) {
    for (let i = group.children.length; i < bouees.length; i++) {
      const x = team === 'BLEU' ? (i + 0.6) * this.DIAMETRE_GOBELET : 3000 - (i + 0.6) * this.DIAMETRE_GOBELET;
      group.add(this.createBouee(x, Y[team], bouees[i]));
    }

    for (let i = group.children.length - 1; i >= bouees.length; i--) {
      group.children[i].destroy();
    }
  }

  private fillCol(group: Konva.Group, bouees: ECouleurBouee[], X: { JAUNE: number; BLEU: number }, team: string) {
    for (let i = group.children.length; i < bouees.length; i++) {
      const y = (i + 0.6) * this.DIAMETRE_GOBELET;
      group.add(this.createBouee(X[team], y, bouees[i]));
    }

    for (let i = group.children.length - 1; i >= bouees.length; i--) {
      group.children[i].destroy();
    }
  }

  private fillDoubleCol(group: Konva.Group, bouees: ECouleurBouee[], X: { JAUNE: number; BLEU: number }, team: string) {
    for (let i = group.children.length; i < bouees.length; i++) {
      const x = X[team] + (i % 2 === 0 ? -1 : 1) * 0.6 * this.DIAMETRE_GOBELET;
      const y = (Math.floor(i / 2) + 0.6) * this.DIAMETRE_GOBELET;
      group.add(this.createBouee(x, y, bouees[i]));
    }

    for (let i = group.children.length - 1; i >= bouees.length; i--) {
      group.children[i].destroy();
    }
  }
}
