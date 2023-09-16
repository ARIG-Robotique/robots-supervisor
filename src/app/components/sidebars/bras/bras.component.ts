import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import Konva from 'konva';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, throttleTime } from 'rxjs/operators';
import { AllConfigBras, AnglesBras, BRAS, Bras, ConfigBras, CurrentBras } from '../../../models/Bras';
import { Point } from '../../../models/Point';
import { Robot } from '../../../models/Robot';
import { BrasService } from '../../../services/bras.service';
import { AppToastService } from '../../../services/toast.service';
import { selectMainRobot } from '../../../store/robots.selector';
import { AbstractSidebarContainer } from '../container/sidebar-container.component';

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

@Component({
    selector: 'arig-sidebar-bras',
    templateUrl: 'bras.component.html',
})
export class SidebarBrasComponent extends AbstractSidebarContainer implements OnInit, AfterViewInit {
    @ViewChild('container', { static: true }) container: ElementRef;

    robot$: Observable<Robot>;
    current: Bras<CurrentBras>;
    config: AllConfigBras;

    stage: Konva.Stage;
    layer: Konva.Layer;

    cursor: Konva.Group;
    brasSym: KonvaNamedGroup;

    bras: Bras<KonvaNamedGroup> = {
        haut: null,
        bas: null,
    };

    selectedBras: BRAS = 'bas';
    angleVentouse = 0;

    logs = '';

    updateSym$ = new Subject<void>();

    get states(): Bras<string[]> {
        return {
            bas: this.config.statesBas,
            haut: this.config.statesHaut,
        };
    }

    constructor(
        private store: Store<any>,
        private brasService: BrasService,
        private toast: AppToastService,
    ) {
        super();
    }

    ngOnInit() {
        this.robot$ = this.store.select(selectMainRobot);
    }

    async ngAfterViewInit() {
        const robot = await this.robot$.pipe(first()).toPromise();
        this.config = await this.brasService.getConfig(robot).toPromise();

        this.stage = new Konva.Stage({
            container: this.container.nativeElement,
            width: 430 * RATIO,
            height: 430 * RATIO,
            y: 430 * RATIO,
            scaleY: -1,
        });

        const bgLayer = new Konva.Layer();
        this.stage.add(bgLayer);
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.stage.width(),
            height: this.stage.height(),
            fill: 'white',
        });
        bgLayer.add(background);

        const bgImage = new Image();
        bgImage.onload = () => {
            const img = new Konva.Image({
                image: bgImage,
                x: 0,
                y: this.stage.height(),
                scaleX: 0.5 * RATIO,
                scaleY: -0.5 * RATIO,
            });
            bgLayer.add(img);
        };
        bgImage.src = '/assets/robots/bras-bg.png';

        this.layer = new Konva.Layer();
        this.layer.setPosition({ x: 115 * RATIO, y: 1 * RATIO });
        this.stage.add(this.layer);

        ['bas', 'haut'].forEach((idBras: BRAS) => {
            this.bras[idBras] = new KonvaNamedGroup();
            this.bras[idBras].add(
                new Konva.Line({
                    name: 'line',
                    points: [0, 0, 0, 0],
                    stroke: 'black',
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: 4 * RATIO,
                }),
            );
            for (let i = 0; i < 4; i++) {
                this.bras[idBras].add(
                    new Konva.Circle({
                        name: `point${i}`,
                        x: 0,
                        y: 0,
                        fill: 'black',
                        radius: 4 * RATIO,
                    }),
                );
            }
            this.layer.add(this.bras[idBras]);
        });

        this.brasSym = new KonvaNamedGroup();
        for (let i = 0; i < 3; i++) {
            this.brasSym.add(
                new Konva.Line({
                    name: `line${i}`,
                    points: [0, 0, 0, 0],
                    stroke: 'blue',
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: 4 * RATIO,
                }),
                new Konva.Circle({
                    name: `point${i}`,
                    x: 0,
                    y: 0,
                    fill: 'blue',
                    radius: 4 * RATIO,
                }),
            );
        }
        this.brasSym.add(
            new Konva.Rect({
                name: 'echantillon',
                x: 0,
                y: 0,
                width: 15 * RATIO,
                height: 150 * RATIO,
                offsetY: 75 * RATIO,
                fill: '#b9b9b9',
                strokeWidth: 1,
                stroke: 'black',
                opacity: 0.8,
            }),
        );
        this.layer.add(this.brasSym);

        this.cursor = new Konva.Group();
        this.cursor.add(
            new Konva.Circle({
                x: 0,
                y: 0,
                fill: 'green',
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
        this.layer.add(this.cursor);

        this.stage.on('click', (e) => {
            if (e.evt.button === 2) {
                this.selectedBras = this.selectedBras === 'bas' ? 'haut' : 'bas';
                this.update();
                this.updateSym$.next();
            } else {
                const pt = this.getPointerPosition();
                const a = this.angleVentouse;
                this.click({ ...pt, a }, this.selectedBras);
            }
        });

        this.stage.on('mousemove', () => {
            this.updateSym$.next();
        });

        this.stage.on('contextmenu', (e) => {
            e.evt.preventDefault();
        });

        this.stage.on('wheel', (e) => {
            this.angleVentouse += e.evt.deltaY < 0 ? 10 : -10;
            if (this.angleVentouse > 180) {
                this.angleVentouse -= 360;
            }
            if (this.angleVentouse <= -180) {
                this.angleVentouse += 360;
            }
            this.updateSym$.next();
            e.evt.preventDefault();
        });

        this.updateSym$
            .pipe(throttleTime(100, undefined, { leading: true, trailing: true }), takeUntil(this.ngDestroy$))
            .subscribe(() => {
                this.setCursor();
            });

        this.update();
    }

    async setBrasByName(bras: BRAS, name: string) {
        const robot = await this.robot$.pipe(first()).toPromise();

        this.selectedBras = bras;

        this.brasService.setBrasByName(robot, bras, name).subscribe(() => {
            this.update();
            this.logs += `${this.selectedBras} : ${name}\n`;
        });
    }

    isStateDisabled(bras: BRAS, state: string) {
        return (
            this.current?.[bras].state &&
            !this.config[bras === 'bas' ? 'transitionsBas' : 'transitionsHaut'].some((transition) => {
                const [from, to] = Object.entries(transition)[0];
                return from === this.current[bras].state && to === state;
            })
        );
    }

    private getPointerPosition(): Point {
        const pos = this.stage.getPointerPosition();
        const x = pos.x - this.layer.x();
        const y = this.stage.height() - pos.y - this.layer.y();
        return { x: Math.round(x / RATIO), y: Math.round(y / RATIO) };
    }

    async update() {
        const robot = await this.robot$.pipe(first()).toPromise();

        this.brasService.getCurrent(robot).subscribe((current) => {
            this.current = current;
            for (const id of Object.keys(this.current)) {
                const { pt0, pt1, pt2, pt3 } = this.getPoints(this.config[id], this.current[id]);

                this.bras[id]
                    .getChild<Konva.Line>('line')
                    .points([pt0.x, pt0.y, pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y]);

                this.bras[id].getChild<Konva.Line>('point0').setPosition(pt0);
                this.bras[id].getChild<Konva.Line>('point1').setPosition(pt1);
                this.bras[id].getChild<Konva.Line>('point2').setPosition(pt2);
                this.bras[id].getChild<Konva.Line>('point3').setPosition(pt3);
            }

            this.angleVentouse = this.current[this.selectedBras].a;
        });
    }

    async click(val: { x: number; y: number; a: number }, bras: BRAS) {
        const robot = await this.robot$.pipe(first()).toPromise();

        this.selectedBras = bras;

        this.brasService.setBras(robot, bras, val).subscribe((done) => {
            if (done) {
                this.update();
                this.logs += `${this.selectedBras} : x=${val.x} y=${val.y} a=${val.a}\n`;
                this.toast.clear();
            } else {
                this.toast.error('Position invalide');
            }
        });
    }

    private async setCursor() {
        const robot = await this.robot$.pipe(first()).toPromise();

        const pt = this.getPointerPosition();
        this.cursor.setPosition({ x: pt.x * RATIO, y: pt.y * RATIO });

        const text = this.cursor.getChildren((children) => children instanceof Konva.Text)[0] as Konva.Text;
        text.text(pt.x + 'x' + pt.y + '@' + this.angleVentouse);

        this.brasService
            .calculerAngles(robot, this.selectedBras, { ...pt, a: this.angleVentouse })
            .subscribe((result) => {
                if (result) {
                    const { pt0, pt1, pt2, pt3 } = this.getPoints(this.config[this.selectedBras], result);

                    const line0 = this.brasSym.getChild<Konva.Line>('line0');
                    const line1 = this.brasSym.getChild<Konva.Line>('line1');
                    const line2 = this.brasSym.getChild<Konva.Line>('line2');
                    const point0 = this.brasSym.getChild<Konva.Circle>('point0');
                    const point1 = this.brasSym.getChild<Konva.Circle>('point1');
                    const point2 = this.brasSym.getChild<Konva.Circle>('point2');
                    const ech = this.brasSym.getChild<Konva.Rect>('echantillon');

                    ech.setPosition(pt3);
                    ech.rotation(this.angleVentouse);

                    line0.points([pt0.x, pt0.y, pt1.x, pt1.y]);
                    line1.points([pt1.x, pt1.y, pt2.x, pt2.y]);
                    line2.points([pt2.x, pt2.y, pt3.x, pt3.y]);

                    line0.stroke(result.a1Error ? 'red' : 'blue');
                    line1.stroke(result.a2Error ? 'red' : 'blue');
                    line2.stroke(result.a3Error ? 'red' : 'blue');

                    point0.setPosition(pt0);
                    point1.setPosition(pt1);
                    point2.setPosition(pt2);

                    point0.fill(result.a1Error ? 'red' : 'blue');
                    point1.fill(result.a2Error ? 'red' : 'blue');
                    point2.fill(result.a3Error ? 'red' : 'blue');

                    this.brasSym.show();
                } else {
                    this.brasSym.hide();
                }
            });
    }

    private getPoints(configBras: ConfigBras, angles: AnglesBras) {
        const pt0 = { x: configBras.x * RATIO, y: configBras.y * RATIO };
        const pt1 = ptAdd(pt0, ptFromAngleRadius(angles.a1, configBras.r1 * RATIO));
        const pt2 = ptAdd(pt1, ptFromAngleRadius(angles.a1 + angles.a2, configBras.r2 * RATIO));
        const pt3 = ptAdd(pt2, ptFromAngleRadius(angles.a1 + angles.a2 + angles.a3, configBras.r3 * RATIO));
        return { pt0, pt1, pt2, pt3 };
    }
}
