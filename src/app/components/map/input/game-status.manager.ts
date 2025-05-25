import Konva from 'konva';
import {TABLE} from '../../../constants/constants';
import {
    GameStatus,
    GradinBrut, GradinBrutId,
    Team,
} from '../../../models/showMustGoOn/GameStatus';

export class GameStatusManager {
    gradinsBruts: Konva.Group;

    constructor(private mainLayer: Konva.Layer) {
        this.gradinsBruts = new Konva.Group();
        this.mainLayer.add(this.gradinsBruts);
        this.gradinsBruts.moveToBottom();
    }

    destroy() {
        this.gradinsBruts.destroy()
    }

    update(status: Partial<GameStatus>, team: Team) {
        this.gradinsBruts.destroyChildren()

        status.gradinBrutStock?.forEach((gradinBrut) => {
            this.addGradinBrut(gradinBrut);
        });
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

    private isGradinVertical = (id: GradinBrutId): boolean => ([
        GradinBrutId.JAUNE_HAUT_GAUCHE,
        GradinBrutId.JAUNE_BAS_GAUCHE,
        GradinBrutId.BLEU_HAUT_DROITE,
        GradinBrutId.BLEU_BAS_DROITE,
    ].includes(id))
}
