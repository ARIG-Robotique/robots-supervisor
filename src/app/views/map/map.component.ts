import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, interval, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractComponent } from '../../components/abstract.component';
import { MapInputComponent } from '../../components/map/input/map-input.component';
import { SidebarBrasComponent } from '../../components/sidebars/bras/bras.component';
import { SidebarCapteursComponent } from '../../components/sidebars/capteurs/capteurs.component';
import { AbstractSidebarContainer } from '../../components/sidebars/container/sidebar-container.component';
import { SidebarExecsComponent } from '../../components/sidebars/execs/execs.component';
import { SidebarMouvementsComponent } from '../../components/sidebars/mouvements/mouvements.component';
import { SidebarServosComponent } from '../../components/sidebars/servos/servos.component';
import { MapPosition } from '../../models/MapPosition';
import { Position } from '../../models/Position';
import { Robot, SelectedRobot } from '../../models/Robot';
import { CapteursService } from '../../services/capteurs.service';
import { MouvementsService } from '../../services/mouvements.service';
import { selectSelectedRobots } from '../../store/robots.selector';

@Component({
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent extends AbstractComponent implements OnInit {
    readonly Buttons = [
        {
            label: 'Servos',
            code: 'servos',
            icon: 'cogs',
            component: SidebarServosComponent,
            size: 'half',
        },
        {
            label: 'Bras',
            code: 'bras',
            icon: 'robot-arm',
            component: SidebarBrasComponent,
            size: 'full',
        },
        {
            label: 'Mouvements',
            code: 'mouvements',
            icon: 'arrows-alt',
            component: SidebarMouvementsComponent,
            size: 'std',
        },
        {
            label: 'Capteurs',
            code: 'capteurs',
            icon: 'heartbeat',
            component: SidebarCapteursComponent,
            size: 'std',
        },
        {
            label: 'Éxécutions',
            code: 'execs',
            icon: 'database',
            component: SidebarExecsComponent,
            size: 'std',
        },
    ];

    @ViewChild(MapInputComponent)
    mapInput: MapInputComponent;

    @ViewChild('sidebarButtons')
    sidebarButtons: TemplateRef<any>;
    offcanvasRef: NgbOffcanvasRef;

    robots$: Observable<SelectedRobot[]>;
    mainRobot$: Observable<SelectedRobot>;
    mainPosition: Position;

    team = '';

    targetPosition: MapPosition;

    mouvementConfig = {
        mode: 'path',
        sensDeplacement: 'AUTO',
        sensRotation: 'AUTO',
    };

    constructor(
        private store: Store<any>,
        private mouvementsService: MouvementsService,
        private capteursService: CapteursService,
        private offcanvas: NgbOffcanvas,
    ) {
        super();
    }

    ngOnInit(): void {
        this.robots$ = this.store.select(selectSelectedRobots);
        this.mainRobot$ = this.robots$.pipe(map((robots) => robots.find((r) => r.main)));

        this.mainRobot$
            .pipe(
                filter((robot) => !!robot),
                switchMap((robot) => this.capteursService.getCapteurs(robot)),
                takeUntil(this.ngDestroy$),
            )
            .subscribe((capteurs) => {
                this.team = capteurs.text.Equipe;
            });

        interval(200)
            .pipe(
                takeUntil(this.ngDestroy$),
                withLatestFrom(this.robots$),
                switchMap(([, robots]) => {
                    return combineLatest(
                        robots.map((robot) => {
                            return this.mouvementsService.getPosition(robot, robot.main).pipe(
                                catchError(() => of(null as Position)),
                                map((position) => ({ robot, position })),
                            );
                        }),
                    );
                }),
            )
            .subscribe((positions) => {
                positions.forEach(({ robot, position }) => {
                    this.mapInput.setPosition(robot.name.toLowerCase(), robot.main, position);
                    if (robot.main) {
                        this.mainPosition = position;
                    }
                });
            });
    }

    openSidebar(sidebar: string) {
        this.offcanvasRef?.close();

        const conf = this.Buttons.find((b) => b.code === sidebar);
        this.offcanvasRef = this.offcanvas.open(conf.component, {
            position: 'end',
            backdrop: false,
            panelClass: `offcanvas-${conf.size}`,
        });
        (this.offcanvasRef.componentInstance as AbstractSidebarContainer).sidebarButtons = this.sidebarButtons;
    }

    positionChanged(robot: Robot, position: Pick<MapPosition, 'x' | 'y'>) {
        this.targetPosition = {
            ...this.targetPosition,
            ...position,
        };

        this.mouvementsService
            .sendMouvement(robot, this.mouvementConfig.mode, {
                ...position,
                sens: this.mouvementConfig.sensDeplacement,
            })
            .subscribe();
    }

    angleChanged(robot: Robot, position: Pick<MapPosition, 'angle'>) {
        this.targetPosition = {
            ...this.targetPosition,
            ...position,
        };

        this.mouvementsService
            .sendMouvement(robot, 'orientation', {
                ...position,
                sens: this.mouvementConfig.sensRotation,
            })
            .subscribe();
    }
}
