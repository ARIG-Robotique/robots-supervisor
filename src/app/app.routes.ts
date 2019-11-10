import {Routes} from '@angular/router';
import {MouvementsComponent} from './views/mouvements/mouvements.component';
import {ServosComponent} from './views/servos/servos.component';
import {RobotComponent} from './views/robot/robot.component';
import {RobotInfoComponent} from './views/robot-info/robot-info.component';
import {MapComponent} from './views/map/map.component';
import {CapteursComponent} from './views/capteurs/capteurs.component';
import {AdminComponent} from './views/admin/admin.component';
import {ActionneursComponent} from './views/actionneurs/actionneurs.component';
import {HomeComponent} from './views/home/home.component';
import {RobotResolve} from './resolvers/RobotResolve';

export const AppRoutes: Routes = [
  {
    path     : '',
    component: HomeComponent,
  },
  {
    path     : 'robot/:idRobot',
    component: RobotComponent,
    resolve  : {
      robot: RobotResolve,
    },
    children : [
      {
        path      : '',
        redirectTo: 'info',
        pathMatch : 'full'
      },
      {
        path     : 'info',
        component: RobotInfoComponent
      },
      {
        path     : 'capteurs',
        component: CapteursComponent
      },
      {
        path     : 'servos',
        component: ServosComponent
      },
      {
        path     : 'actionneurs',
        component: ActionneursComponent
      },
      {
        path     : 'mouvement',
        component: MouvementsComponent
      },
      {
        path     : 'map',
        component: MapComponent
      }
    ]
  },
  {
    path     : 'admin',
    component: AdminComponent
  }
];
