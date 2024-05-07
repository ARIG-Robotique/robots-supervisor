import { Point } from 'app/models/Point';
import Konva from 'konva';
import { TABLE } from '../../../constants/constants';
import {
    CouleurPanneauSolaire,
    Emplacement,
    GameStatus,
    Plante,
    StockPots,
    StockPotsId,
    Team,
    TypePlante,
} from '../../../models/farmingMars/GameStatus';

function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

const PANNEAU_X = [
    275,
    275 + 225,
    275 + 225 + 255,
    275 + 225 + 225 + 550,
    275 + 225 + 225 + 550 + 225,
    275 + 225 + 225 + 550 + 225 + 225,
    275 + 225 + 225 + 550 + 225 + 225 + 550,
    275 + 225 + 225 + 550 + 225 + 225 + 550 + 225,
    275 + 225 + 225 + 550 + 225 + 225 + 550 + 225 + 225,
];

const PANNEAU_Y = 2000 + 22 + 15;

const DISTRIBS_PLANTES: Point[] = [
    { x: 1500, y: 1500 },
    { x: 1000, y: 1300 },
    { x: 1000, y: 700 },
    { x: 1500, y: 500 },
    { x: 2000, y: 700 },
    { x: 2000, y: 1300 },
];

const DISTRIBS_POTS: Record<StockPotsId, Point & { dir: number }> = {
    BLEU_NORD: { x: 35, y: 1387.5, dir: 0 },
    BLEU_MILIEU: { x: 35, y: 612.5, dir: 0 },
    BLEU_SUD: { x: 1000, y: 35, dir: Math.PI / 2 },
    JAUNE_NORD: { x: 2965, y: 1387.5, dir: Math.PI },
    JAUNE_MILIEU: { x: 2965, y: 612.5, dir: Math.PI },
    JAUNE_SUD: { x: 2000, y: 35, dir: Math.PI / 2 },
};

const AIRES_DEPOSE: Record<Team, Record<Emplacement, Point & { dir: number }>> = {
    BLEU: {
        NORD: { x: 35, y: 1880, dir: 1 },
        MILIEU: { x: 3000 - 35, y: 1105, dir: -1 },
        SUD: { x: 35, y: 330, dir: 1 },
    },
    JAUNE: {
        NORD: { x: 3000 - 35, y: 1880, dir: -1 },
        MILIEU: { x: 35, y: 1105, dir: 1 },
        SUD: { x: 3000 - 35, y: 330, dir: -1 },
    },
};

export class GameStatusManager {
    panneaux: Konva.Group;
    plantes: Konva.Group;
    pots: Konva.Group;

    constructor(private mainLayer: Konva.Layer) {
        this.panneaux = new Konva.Group();
        this.mainLayer.add(this.panneaux);
        this.panneaux.moveToBottom();

        this.plantes = new Konva.Group();
        this.mainLayer.add(this.plantes);
        this.plantes.moveToBottom();

        this.pots = new Konva.Group();
        this.mainLayer.add(this.pots);
        this.pots.moveToBottom();

        const panneauImage = new Image();
        panneauImage.onload = () => {
            for (let i = 0; i < 9; i++) {
                this.panneaux.add(
                    new Konva.Image({
                        image: panneauImage,
                        width: 100 * TABLE.imageRatio,
                        height: 100 * TABLE.imageRatio,
                        x: PANNEAU_X[i] * TABLE.imageRatio,
                        y: PANNEAU_Y * TABLE.imageRatio,
                        offsetX: 50 * TABLE.imageRatio,
                        offsetY: 35 * TABLE.imageRatio,
                        rotation: 0,
                    }),
                );
            }
        };
        panneauImage.src = 'assets/tables/panneau.png';
    }

    destroy() {
        this.panneaux.destroy();
        this.pots.destroy();
        this.plantes.destroy();
    }

    update(status: Partial<GameStatus>, team: Team) {
        this.plantes.destroyChildren();
        this.pots.destroyChildren();

        status.plantes?.forEach((plante) => {
            this.addPlante(plante);
        });

        status.stocksPots?.forEach((stock) => {
            this.addStockPots(stock);
        });

        Object.entries(status.airesDepose ?? {}).forEach(([aire, plante]) => {
            this.addAireDepose(plante, aire as Emplacement, team);
        });

        status.panneaux?.forEach(({ color }, i) => {
            const panneau = this.panneaux.children.at(i);
            if (color === CouleurPanneauSolaire.JAUNE_ET_BLEU) {
                panneau.rotation(180);
            } else if (color === CouleurPanneauSolaire.BLEU || color === CouleurPanneauSolaire.WIP_BLEU) {
                panneau.rotation(90);
            } else if (color === CouleurPanneauSolaire.JAUNE || color === CouleurPanneauSolaire.WIP_JAUNE) {
                panneau.rotation(-90);
            } else {
                panneau.rotation(0);
            }
        });
    }

    private addPlante(plante: Plante) {
        this.plantes.add(
            new Konva.Circle({
                x: plante.x * TABLE.imageRatio,
                y: (TABLE.height - plante.y) * TABLE.imageRatio,
                radius: 25 * TABLE.imageRatio - 2,
                strokeWidth: 4,
                fill: plante.type === TypePlante.FRAGILE ? 'white' : plante.type === TypePlante.RESISTANTE ? '#9b6aa6' : 'orange',
                stroke: plante.type === TypePlante.FRAGILE ? '#005b32' : plante.type === TypePlante.RESISTANTE ? '#8cce06' : 'orangered',
            }),
        );

        if (plante.dansPot && plante.x && plante.y) {
            this.addPot(plante as Point);
        }
    }

    private addPot(pt: Point, rouge = false) {
        this.pots.add(
            new Konva.Circle({
                x: pt.x * TABLE.imageRatio,
                y: (TABLE.height - pt.y) * TABLE.imageRatio,
                radius: 35 * TABLE.imageRatio - 2,
                strokeWidth: 4,
                fill: '#3d3d3d',
                stroke: rouge ? 'red' : '#686868',
            }),
        );
    }

    private addStockPots(stock: StockPots) {
        if (stock.present) {
            this.addPot(DISTRIBS_POTS[stock.id], stock.bloque);

            // le deuxième n'est pas affiché

            for (let k = 2; k < 6; k++) {
                const angle = mapLinear(k, 2, 5, -Math.PI / 2, Math.PI / 2) + DISTRIBS_POTS[stock.id].dir;
                const dx = 70 * Math.cos(angle);
                const dy = 70 * Math.sin(angle);
                this.addPot(
                    {
                        x: DISTRIBS_POTS[stock.id].x + dx,
                        y: DISTRIBS_POTS[stock.id].y + dy,
                    },
                    stock.bloque,
                );
            }
        }
    }

    private addAireDepose(plantes: Plante[], aire: Emplacement, team: Team) {
        const config = AIRES_DEPOSE[team][aire];
        plantes.forEach((plante, i) => {
            this.addPlante({
                ...plante,
                x: config.x + Math.floor(i / 3) * 70 * config.dir,
                y: config.y + ((i % 3) - 2.5) * 70,
            });
        });
    }
}
