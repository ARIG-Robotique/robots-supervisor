import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import Konva from 'konva';
import { firstValueFrom, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { AnglesBras, BRAS, Bras, ConfigBras, CurrentBras, FullConfigBras, PointBras } from '../../../models/Bras';
import { Point } from '../../../models/Point';
import { Robot } from '../../../models/Robot';
import { Servo, ServoPosition } from '../../../models/Servo';
import { BrasService } from '../../../services/bras.service';
import { ServosService } from '../../../services/servos.service';
import { AppToastService } from '../../../services/toast.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';
import { KeyValue } from '@angular/common';

function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}

function ptFromAngleRadius(a: number, r: number): Point {
    return { x: Math.cos(toRadians(a)) * r, y: Math.sin(toRadians(a)) * r };
}

function ptAdd(pt1: Point, pt2: Point): Point {
    return { x: pt1.x + pt2.x, y: pt1.y + pt2.y };
}

class KonvaNamedGroup extends Konva.Group {
    getChild<T extends Konva.Node>(name: string): T {
        return this.getChildren((item) => item.name() === name)[0] as any as T;
    }
}

const RATIO = 1.5;

const OFFSETS_IMAGES = [
    { offsetX: 25, offsetY: 91, rotation: -22 },
    { offsetX: 25, offsetY: 25, rotation: 22 },
    { offsetX: 86, offsetY: 26, rotation: 90 },
];

const COLORS: Bras<string> = {
    AVANT_GAUCHE: '#e41a1c',
    AVANT_CENTRE: '#377eb8',
    AVANT_DROIT: '#4daf4a',
    ARRIERE_GAUCHE: '#984ea3',
    ARRIERE_CENTRE: '#ff7f00',
    ARRIERE_DROIT: '#ffff33',
};

const GROUPE_AVANT = ['AVANT_GAUCHE', 'AVANT_CENTRE', 'AVANT_DROIT'];
const GROUPE_ARRIERE = ['ARRIERE_GAUCHE', 'ARRIERE_CENTRE', 'ARRIERE_DROIT'];

@Component({
    selector: 'arig-sidebar-bras',
    templateUrl: 'bras.component.html',
    styleUrls: ['bras.component.scss'],
})
export class SidebarBrasComponent extends AbstractSidebarContainer implements AfterViewInit, OnDestroy {
    readonly COLORS = COLORS;

    @ViewChild('container', { static: true }) container: ElementRef;

    robot: Robot;
    current: Bras<CurrentBras>;
    config: Bras<FullConfigBras>;
    pinces: Bras<Servo>;

    stage: Konva.Stage;
    layer: Konva.Layer;
    layerSym: Konva.Layer;

    cursor: Konva.Group;
    brasSym: KonvaNamedGroup;

    groups: Bras<KonvaNamedGroup> = {};

    groupMode = false;
    selectedBras: BRAS;

    logs = '';

    trackByName = (i: number, item: KeyValue<string, ServoPosition>) => item.key;

    private needsUpdateSym = false;
    private updateSymRAF: ReturnType<typeof requestAnimationFrame>;

    get names(): BRAS[] {
        // return Object.keys(this.config);
        return ['ARRIERE_GAUCHE', 'ARRIERE_CENTRE', 'ARRIERE_DROIT', 'AVANT_GAUCHE', 'AVANT_CENTRE', 'AVANT_DROIT'];
    }

    get selectedBrasConfig() {
        return this.config[this.selectedBras].config;
    }

    get selectedBrasCurrent() {
        return this.current[this.selectedBras];
    }

    get selectedGroup() {
        return GROUPE_ARRIERE.includes(this.selectedBras) ? GROUPE_ARRIERE : GROUPE_AVANT;
    }

    constructor(
        private store: Store<any>,
        private brasService: BrasService,
        private servosService: ServosService,
        private toast: AppToastService,
    ) {
        super();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        cancelAnimationFrame(this.updateSymRAF);
    }

    async ngAfterViewInit() {
        this.robot = await firstValueFrom(this.store.select(selectMainRobot).pipe(first()));
        this.config = await firstValueFrom(this.brasService.getConfig(this.robot));

        this.selectedBras = this.names[0];

        const servos = await firstValueFrom(this.servosService.getServos(this.robot));
        this.pinces = {
            AVANT_GAUCHE: servos
                .find(({ name }) => name === 'Pinces avant')
                .servos.find(({ name }) => name == 'Pince avant gauche'),
            AVANT_CENTRE: servos
                .find(({ name }) => name === 'Pinces avant')
                .servos.find(({ name }) => name == 'Pince avant centre'),
            AVANT_DROIT: servos
                .find(({ name }) => name === 'Pinces avant')
                .servos.find(({ name }) => name == 'Pince avant droite'),
            ARRIERE_GAUCHE: servos
                .find(({ name }) => name === 'Pinces arrière')
                .servos.find(({ name }) => name == 'Pince arrière gauche'),
            ARRIERE_CENTRE: servos
                .find(({ name }) => name === 'Pinces arrière')
                .servos.find(({ name }) => name == 'Pince arrière centre'),
            ARRIERE_DROIT: servos
                .find(({ name }) => name === 'Pinces arrière')
                .servos.find(({ name }) => name == 'Pince arrière droite'),
        };

        // l'origine est au milieu en bas, et l'axe vertical est positif vers le haut
        this.stage = new Konva.Stage({
            container: this.container.nativeElement,
            width: 645 * RATIO,
            height: 430 * RATIO,
            y: 430 * RATIO,
            x: 322 * RATIO,
            scaleY: -1,
        });

        // image de fond
        const bgLayer = new Konva.Layer({
            x: -this.stage.x(),
            y: 0,
        });
        this.stage.add(bgLayer);

        const bgImage = new Image();
        bgImage.onload = () => {
            const img = new Konva.Image({
                image: bgImage,
                x: -1,
                y: this.stage.height(),
                scaleX: 0.5 * RATIO,
                scaleY: -0.5 * RATIO,
            });
            bgLayer.add(img);
        };
        bgImage.src = '/assets/robots/bras-bg.png';

        // calques des bras
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        Object.keys(this.config).forEach((idBras: BRAS) => {
            this.groups[idBras] = new KonvaNamedGroup();
            this.groups[idBras].add(
                new Konva.Line({
                    name: 'line',
                    points: [0, 0, 0, 0],
                    stroke: COLORS[idBras],
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: 4 * RATIO,
                }),
            );
            for (let i = 0; i < 4; i++) {
                this.groups[idBras].add(
                    new Konva.Circle({
                        name: `point${i}`,
                        x: 0,
                        y: 0,
                        fill: COLORS[idBras],
                        radius: 4 * RATIO,
                    }),
                );
            }
            this.layer.add(this.groups[idBras]);
        });

        // calque du bras "live"
        this.layerSym = new Konva.Layer();
        this.stage.add(this.layerSym);

        this.brasSym = new KonvaNamedGroup();
        for (let i = 0; i < 3; i++) {
            this.brasSym.add(
                new Konva.Group({
                    name: `bras${i}`,
                }),
                new Konva.Line({
                    name: `line${i}`,
                    points: [0, 0, 0, 0],
                    stroke: 'black',
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: 4 * RATIO,
                }),
                new Konva.Circle({
                    name: `point${i}`,
                    x: 0,
                    y: 0,
                    fill: 'black',
                    radius: 4 * RATIO,
                }),
            );

            const image = new Image();
            image.onload = () => {
                const img = new Konva.Image({
                    name: `bras${i}`,
                    image: image,
                    ...OFFSETS_IMAGES[i],
                    scaleX: 0.5 * RATIO,
                    scaleY: -0.5 * RATIO,
                    opacity: 0.5,
                });
                this.brasSym.getChild<Konva.Group>(`bras${i}`).add(img);
            };
            image.src = `/assets/robots/bras-${i + 1}.png`;
        }

        this.layerSym.add(this.brasSym);

        // calque du curseur
        const cursorLayer = new Konva.Layer();
        this.stage.add(cursorLayer);

        this.cursor = new Konva.Group();
        this.cursor.add(
            new Konva.Circle({
                x: 0,
                y: 0,
                fill: 'black',
                radius: 4 * RATIO,
            }),
            new Konva.Text({
                x: 10,
                y: 20,
                scaleY: -1,
                width: 150,
                height: 16,
                text: '0:0@0',
                fontSize: 16,
                fontStyle: 'bold',
                fill: 'black',
                stroke: 'white',
                strokeWidth: 2,
                fillAfterStrokeEnabled: true,
            }),
        );
        cursorLayer.add(this.cursor);

        this.stage.on('click', (e) => {
            if (e.evt.button === 2) {
                this.selectedBrasCurrent.invertA1 = !this.selectedBrasCurrent.invertA1;
                this.needsUpdateSym = true;
            } else {
                const pt = this.getPointerPosition();
                const a = this.selectedBrasCurrent.a;
                const invertA1 = this.selectedBrasCurrent.invertA1;
                this.setBras({ ...pt, a, invertA1 }, this.selectedBras);
            }
        });

        this.stage.on('mousemove', () => {
            this.needsUpdateSym = true;
        });

        this.stage.on('contextmenu', (e) => {
            e.evt.preventDefault();
        });

        this.stage.on('wheel', (e) => {
            this.selectedBrasCurrent.a += e.evt.deltaY < 0 ? 10 : -10;
            if (this.selectedBrasCurrent.a > 180) {
                this.selectedBrasCurrent.a -= 360;
            }
            if (this.selectedBrasCurrent.a <= -180) {
                this.selectedBrasCurrent.a += 360;
            }
            this.needsUpdateSym = true;
            e.evt.preventDefault();
        });

        this.onChangeBras();
        this.updateCurrent();
        this.updateSym();
    }

    private updateSym() {
        if (this.needsUpdateSym) {
            this.drawSym();
            this.needsUpdateSym = false;
        }
        this.updateSymRAF = requestAnimationFrame(() => this.updateSym());
    }

    setBrasByName(selectedBras: BRAS, name: string) {
        this.selectedBras = selectedBras;
        this.onChangeBras();

        const toUpdate = this.groupMode ? this.selectedGroup : [this.selectedBras];

        forkJoin(
            toUpdate.map((bras) => {
                return this.brasService.setBrasByName(this.robot, bras, name);
            }),
        ).subscribe(() => {
            this.updateCurrent();
            this.logs += `${toUpdate} : ${name}\n`;
        });
    }

    setPince(selectedBras: BRAS, servo: Servo) {
        this.selectedBras = selectedBras;
        this.onChangeBras();

        const position = Object.values(servo.positions).find((p) => p.value === servo.currentPosition);

        const toUpdate = this.groupMode ? this.selectedGroup : [this.selectedBras];

        forkJoin(
            toUpdate.map((bras) => {
                const pince = this.pinces[bras];
                pince.currentPosition = position.value;
                pince.currentSpeed = position.speed;
                return this.servosService.setPosition(this.robot, pince, pince.currentPosition, pince.currentSpeed);
            }),
        ).subscribe(() => {
            this.logs += `${toUpdate} : pince=${position.name}\n`;
        });
    }

    isActive(bras: BRAS) {
        if (!this.groupMode) {
            return bras === this.selectedBras;
        } else {
            return this.selectedGroup.includes(bras);
        }
    }

    isStateDisabled(bras: BRAS, state: string) {
        return (
            this.current?.[bras].state &&
            this.config[bras].transitions.length &&
            !this.config[bras].transitions.some((transition) => {
                const [from, to] = Object.entries(transition)[0];
                return from === this.current?.[bras].state && to === state;
            })
        );
    }

    onChangeBras() {
        this.layerSym.scaleX(this.selectedBrasConfig.back ? -1 : 1);
    }

    private getPointerPosition(): Point {
        const pos = this.stage.getPointerPosition();
        let x = pos.x - this.stage.x();
        const y = this.stage.height() - pos.y;
        if (this.selectedBrasConfig.back) {
            x = -x;
        }
        return { x: Math.round(x / RATIO), y: Math.round(y / RATIO) };
    }

    private updateCurrent() {
        this.brasService.getCurrent(this.robot).subscribe((current) => {
            this.current = current;
            for (const id of Object.keys(this.current)) {
                const { pt0, pt1, pt2, pt3 } = this.getPoints(this.config[id].config, this.current[id], false);

                this.groups[id]
                    .getChild<Konva.Line>('line')
                    .points([pt0.x, pt0.y, pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y]);

                this.groups[id].getChild<Konva.Line>('point0').setPosition(pt0);
                this.groups[id].getChild<Konva.Line>('point1').setPosition(pt1);
                this.groups[id].getChild<Konva.Line>('point2').setPosition(pt2);
                this.groups[id].getChild<Konva.Line>('point3').setPosition(pt3);
            }
        });
    }

    setBras(val: PointBras, selectedBras: BRAS) {
        this.selectedBras = selectedBras;
        this.onChangeBras();

        const toUpdate = this.groupMode ? this.selectedGroup : [this.selectedBras];

        forkJoin(
            toUpdate.map((bras) => {
                return this.brasService.setBras(this.robot, bras, val);
            }),
        ).subscribe((done) => {
            if (done.every((d) => d)) {
                this.updateCurrent();
                this.logs += `${toUpdate} : x=${val.x} y=${val.y} a=${val.a} invertA1=${val.invertA1}\n`;
                this.toast.clear();
            } else {
                this.toast.error('Position invalide');
            }
        });
    }

    private drawSym() {
        const pt = this.getPointerPosition();
        this.cursor.setPosition({ x: pt.x * RATIO * (this.selectedBrasConfig.back ? -1 : 1), y: pt.y * RATIO });

        const a = this.selectedBrasCurrent.a;
        const invertA1 = this.selectedBrasCurrent.invertA1;

        const text = this.cursor.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
        text.text(pt.x + 'x' + pt.y + '@' + a);

        this.brasService.calculerAngles(this.robot, this.selectedBras, { ...pt, a, invertA1 }).subscribe((result) => {
            if (result) {
                const { pt0, pt1, pt2, pt3 } = this.getPoints(this.selectedBrasConfig, result, true);

                const line0 = this.brasSym.getChild<Konva.Line>('line0');
                const line1 = this.brasSym.getChild<Konva.Line>('line1');
                const line2 = this.brasSym.getChild<Konva.Line>('line2');
                const point0 = this.brasSym.getChild<Konva.Circle>('point0');
                const point1 = this.brasSym.getChild<Konva.Circle>('point1');
                const point2 = this.brasSym.getChild<Konva.Circle>('point2');
                const bras0 = this.brasSym.getChild<Konva.Group>('bras0');
                const bras1 = this.brasSym.getChild<Konva.Group>('bras1');
                const bras2 = this.brasSym.getChild<Konva.Image>('bras2');

                bras0.setPosition(pt0);
                bras1.setPosition(pt1);
                bras2.setPosition(pt2);

                bras0.rotation(result.a1);
                bras1.rotation(result.a1 + result.a2);
                bras2.rotation(result.a1 + result.a2 + result.a3);

                line0.points([pt0.x, pt0.y, pt1.x, pt1.y]);
                line1.points([pt1.x, pt1.y, pt2.x, pt2.y]);
                line2.points([pt2.x, pt2.y, pt3.x, pt3.y]);

                line0.stroke(result.a1Error ? 'red' : 'black');
                line1.stroke(result.a2Error ? 'red' : 'black');
                line2.stroke(result.a3Error ? 'red' : 'black');

                point0.setPosition(pt0);
                point1.setPosition(pt1);
                point2.setPosition(pt2);

                point0.fill(result.a1Error ? 'red' : 'black');
                point1.fill(result.a2Error ? 'red' : 'black');
                point2.fill(result.a3Error ? 'red' : 'black');

                this.brasSym.show();
            } else {
                this.brasSym.hide();
            }
        });
    }

    private getPoints(configBras: ConfigBras, angles: AnglesBras, isSym: boolean) {
        const pt0 = { x: configBras.x * RATIO, y: configBras.y * RATIO };
        const pt1 = ptAdd(pt0, ptFromAngleRadius(angles.a1, configBras.r1 * RATIO));
        const pt2 = ptAdd(pt1, ptFromAngleRadius(angles.a1 + angles.a2, configBras.r2 * RATIO));
        const pt3 = ptAdd(pt2, ptFromAngleRadius(angles.a1 + angles.a2 + angles.a3, configBras.r3 * RATIO));
        if (!isSym && configBras.back) {
            pt0.x = -pt0.x;
            pt1.x = -pt1.x;
            pt2.x = -pt2.x;
            pt3.x = -pt3.x;
        }
        return { pt0, pt1, pt2, pt3 };
    }
}
