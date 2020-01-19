import {Component, OnDestroy, OnInit} from '@angular/core';
import {Robot} from '../../models/Robot';
import {RobotsService} from '../../services/robots.service';
import {Exec} from '../../models/Exec';
import {BehaviorSubject, Observable} from 'rxjs';
import {AbstractComponent} from '../../components/abstract.component';
import {map, switchMap, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectRobots} from '../../store/robots.selector';
import {deleteRobot} from '../../store/robots.actions';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddRobotModalComponent} from '../../components/add-robot-modal/add-robot-modal.component';
import {RobotUI} from '../../models/RobotUI';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector   : 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls  : ['./admin.component.scss']
})
export class AdminComponent extends AbstractComponent implements OnInit, OnDestroy {

  robots$: Observable<RobotUI[]>;
  execs$ = new BehaviorSubject<Exec[]>([]);
  selectedRobot: RobotUI = null;

  constructor(private store: Store<any>,
              private modal: NgbModal,
              private robotsService: RobotsService,
              private toastService: ToastrService) {
    super();
  }

  ngOnInit() {
    this.robots$ = this.store.select(selectRobots)
      .pipe(
        map(robots => {
          return robots.map(robot => (<RobotUI>{
            ...robot,
            copying: false,
            message: '',
          }));
        })
      );
  }

  addRobot() {
    this.modal.open(AddRobotModalComponent);
  }

  editRobot(robot: Robot) {
    const modalRef = this.modal.open(AddRobotModalComponent);
    modalRef.componentInstance.robot = {...robot};
  }

  deleteRobot(robot: Robot) {
    const ok = confirm('Etes-vous sûr ?');

    if (ok) {
      this.robotsService.deleteRobot(robot.id)
        .subscribe(() => {
          if (this.selectedRobot && this.selectedRobot.id === robot.id) {
            this.selectRobot(null);
          }
          this.store.dispatch(deleteRobot({id: robot.id}));
        });
    }
  }

  selectRobot(robot: RobotUI) {
    if (!robot) {
      this.selectedRobot = null;
      this.execs$.next([]);
    } else if (this.selectedRobot && this.selectedRobot.id === robot.id) {
      this.selectRobot(null);
    } else {
      this.selectedRobot = robot;
      this.robotsService.getRobotExecs(robot.id)
        .subscribe((execs) => {
          this.execs$.next(execs);
        });
    }
  }

  importLogs(robot: RobotUI) {
    (robot.simulateur ? this.importLog(robot) : this.copyLogs(robot))
      .subscribe({
        error   : () => {
          robot.copying = false;
          robot.message = '';
        },
        complete: () => {
          robot.copying = false;
          robot.message = '';
        }
      });
  }

  deleteExec(exec: Exec) {
    this.robotsService.deleteRobotExec(exec.id)
      .subscribe(() => {
        this.execs$.next(this.execs$.value.filter(e => e !== exec));
      });
  }

  private copyLogs(robot: RobotUI) {
    robot.copying = true;
    robot.message = 'copie les logs';

    return this.robotsService.copyLogs(robot.id)
      .pipe(
        tap({
          next : () => this.toastService.success('Les logs sont copiés'),
          error: () => this.toastService.error('Erreur lors de copie des logs'),
        }),
        switchMap(() => this.importLog(robot))
      );
  }

  private importLog(robot: RobotUI) {
    robot.copying = true;
    robot.message = 'importe les logs';

    return this.robotsService.importLogs(robot.id)
      .pipe(
        tap({
          next : () => this.toastService.success('Les logs sont importés'),
          error: () => this.toastService.error('Erreur lors de l\'import des logs'),
        })
      );
  }

}
