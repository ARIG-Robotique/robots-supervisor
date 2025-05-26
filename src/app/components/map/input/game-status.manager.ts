import Konva from 'konva';
import {TABLE} from '../../../constants/constants';
import {GameStatus, GradinBrut, GradinBrutId, Team,} from '../../../models/showMustGoOn/GameStatus';
import {start} from "@popperjs/core";

export class GameStatusManager {
    gradinsBruts: Konva.Group;
    airesConstruction: Konva.Group;

    constructor(private mainLayer: Konva.Layer) {
        this.gradinsBruts = new Konva.Group();
        this.mainLayer.add(this.gradinsBruts);
        this.gradinsBruts.moveToBottom();

        this.airesConstruction = new Konva.Group();
        this.mainLayer.add(this.airesConstruction);
        this.airesConstruction.moveToBottom();
    }

    destroy() {
        this.gradinsBruts.destroy()
        this.airesConstruction.destroy()
    }

    update(status: Partial<GameStatus>, team: Team) {
        this.gradinsBruts.destroyChildren()
        this.airesConstruction.destroyChildren()

        status.gradinBrutStock?.forEach((gradinBrut) => {
            this.addGradinBrut(gradinBrut);
        });

        this.addAireConstruction(status.airesConstruction?.petitEquipe, team === Team.JAUNE ? 550 : 2000)
        this.addAireConstruction(status.airesConstruction?.grandEquipe, team === Team.JAUNE ? 1000 : 1550)
        this.addAireConstruction(status.airesConstruction?.petitAdverse, team === Team.JAUNE ? 2000 : 550)
        this.addAireConstruction(status.airesConstruction?.grandAdverse, team === Team.JAUNE ? 1550 : 1000)
    }

    private addGradinBrut(gradinBrut: GradinBrut) {
        if (!gradinBrut.present) return;

        const isVertical = !!this.isGradinVertical(gradinBrut.id);

        const plancheGroup = new Konva.Group({
            x: (gradinBrut.x - (isVertical ? 50 : 200)) * TABLE.imageRatio,
            y: (TABLE.height - gradinBrut.y - (isVertical ? -200 : 50)) * TABLE.imageRatio,
            width: 400,
            height: 100,
            scaleX: TABLE.imageRatio,
            scaleY: TABLE.imageRatio,
            rotation: isVertical ? -90 : 0,
        })

        const planche = new Konva.Rect({
            x: 0,
            y: 0,
            width: 400,
            height: 100,
            strokeWidth: gradinBrut.bloque ? 10 : 0,
            fill: '#a97a57',
            stroke: '#ff0000'
        })
        plancheGroup.add(planche)
        planche.moveToBottom()

        const plancheText = new Konva.Text({
            text: gradinBrut.id.split('_').slice(1, 3).join(' '),
            x: 0,
            y: 0,
            width: 400,
            height: 100,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 40,
            fontStyle: 'bold',
            fill: 'black',
            stroke: 'white',
            strokeWidth: 5,
            fillAfterStrokeEnabled: true,
        })
        plancheGroup.add(plancheText)
        plancheText.moveToTop()

        this.gradinsBruts.add(plancheGroup)
    }

    private addAireConstruction(aireConstruction: boolean[][], startX: number) {
        aireConstruction.forEach((gradinConstruit, index) => this.addGradinConstruit(gradinConstruit, startX, index))
    }

    private addGradinConstruit(gradinConstruit: boolean[], startX: number, index: number) {
        if (!gradinConstruit[0]) return;

        const gradinGroup = new Konva.Group({
            x: (startX + 25) * TABLE.imageRatio,
            y: (TABLE.height - 150 - index * 125) * TABLE.imageRatio,
            width: 400,
            height: 100,
            scaleX: TABLE.imageRatio,
            scaleY: TABLE.imageRatio,
        })

        const gradin = new Konva.Rect({
            x: 0,
            y: 0,
            width: 400,
            height: 100,
            fill: '#a97a57',
        })
        gradinGroup.add(gradin)
        gradin.moveToBottom()

        const gradinText = new Konva.Text({
            text: (gradinConstruit.lastIndexOf(true) + 1).toString(),
            x: 0,
            y: 0,
            width: 400,
            height: 100,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 65,
            fontStyle: 'bold',
            fill: 'black',
            stroke: 'white',
            strokeWidth: 5,
            fillAfterStrokeEnabled: true,
        })
        gradinGroup.add(gradinText)
        gradinText.moveToTop()

        this.gradinsBruts.add(gradinGroup)
    }

    private isGradinVertical = (id: GradinBrutId): boolean => ([
        GradinBrutId.JAUNE_HAUT_GAUCHE,
        GradinBrutId.JAUNE_BAS_GAUCHE,
        GradinBrutId.BLEU_HAUT_DROITE,
        GradinBrutId.BLEU_BAS_DROITE,
    ].includes(id))
}
