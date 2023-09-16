import { Point } from 'app/models/Point';
import Konva from 'konva';
import { TABLE } from '../../../constants/constants';
import { DistribPot, GameStatus, PlanteEnPot, TypePlante } from '../../../models/farmingMars/GameStatus';

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
    { x: 1500, y: 1600 },
    { x: 1000, y: 1300 },
    { x: 1000, y: 700 },
    { x: 1500, y: 400 },
    { x: 2000, y: 700 },
    { x: 2000, y: 1300 },
];

const DISTRIBS_POTS: Record<DistribPot, Point & { dir: number }> = {
    L1: { x: 35, y: 1387.5, dir: 0 },
    L2: { x: 35, y: 612.5, dir: 0 },
    LB: { x: 1000, y: 35, dir: Math.PI / 2 },
    R1: { x: 2965, y: 1387.5, dir: Math.PI },
    R2: { x: 2965, y: 612.5, dir: Math.PI },
    RB: { x: 2000, y: 35, dir: Math.PI / 2 },
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

    update(status: Partial<GameStatus>, team: string) {
        this.plantes.destroyChildren();
        this.pots.destroyChildren();

        status.plantes.forEach((plante) => {
            this.addPlante(plante);
        });

        status.distribsPlantes.forEach((count, i) => {
            this.addDistribPlantes(count, i);
        });

        Object.entries(status.distribsPots).forEach(([distrib, count]) => {
            this.addDistribPots(count, distrib as DistribPot);
        });

        status.panneaux.forEach(({ BLEU, JAUNE }, i) => {
            const panneau = this.panneaux.children.at(i);
            if (BLEU && JAUNE) {
                panneau.rotation(180);
            } else if (BLEU) {
                panneau.rotation(90);
            } else if (JAUNE) {
                panneau.rotation(-90);
            } else {
                panneau.rotation(0);
            }
        });
    }

    private addPlante(plante: PlanteEnPot) {
        this.plantes.add(
            new Konva.Circle({
                x: plante.pt.x * TABLE.imageRatio,
                y: (TABLE.height - plante.pt.y) * TABLE.imageRatio,
                radius: 25 * TABLE.imageRatio - 2,
                strokeWidth: 4,
                fill: plante.type === TypePlante.FRAGILE ? '#fcfcfa' : '#9b6aa6',
                stroke: plante.type === TypePlante.FRAGILE ? '#005b32' : '#8cce06',
            }),
        );

        if (plante.pot) {
            this.addPot(plante.pt);
        }
    }

    private addPot(pt: Point) {
        this.pots.add(
            new Konva.Circle({
                x: pt.x * TABLE.imageRatio,
                y: (TABLE.height - pt.y) * TABLE.imageRatio,
                radius: 35 * TABLE.imageRatio - 2.5,
                strokeWidth: 5,
                fill: '#3d3d3d',
                stroke: '#686868',
            }),
        );
    }

    private addDistribPlantes(count: number, i: number) {
        if (count > 0) {
            this.addPlante({
                type: TypePlante.RESISTANTE,
                pot: false,
                pt: DISTRIBS_PLANTES[i],
            });
        }

        for (let k = 1; k < count; k++) {
            const angle = mapLinear(k, 1, count, 0, Math.PI * 2);
            const dx = 70 * Math.cos(angle);
            const dy = 70 * Math.sin(angle);
            this.addPlante({
                type: k === 2 ? TypePlante.RESISTANTE : TypePlante.FRAGILE,
                pot: false,
                pt: {
                    x: DISTRIBS_PLANTES[i].x + dx,
                    y: DISTRIBS_PLANTES[i].y + dy,
                },
            });
        }
    }

    private addDistribPots(count: number, distrib: DistribPot) {
        if (count > 0) {
            this.addPot(DISTRIBS_POTS[distrib]);
        }

        // le deuxième n'est pas affiché

        for (let k = 2; k < count; k++) {
            const angle = mapLinear(k, 2, count - 1, -Math.PI / 2, Math.PI / 2) + DISTRIBS_POTS[distrib].dir;
            const dx = 70 * Math.cos(angle);
            const dy = 70 * Math.sin(angle);
            this.addPot({
                x: DISTRIBS_POTS[distrib].x + dx,
                y: DISTRIBS_POTS[distrib].y + dy,
            });
        }
    }
}
