import {Routes} from '@angular/router';
import {MouvementsComponent} from './views/mouvements/mouvements.component';
import {ServosComponent} from './views/servos/servos.component';
import {RobotComponent} from './views/robot/robot.component';
import {RobotInfoComponent} from './views/robot-info/robot-info.component';
import {MapComponent} from './views/map/map.component';
import {CapteursComponent} from './views/capteurs/capteurs.component';
import {AdminComponent} from './components/admin/admin.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'robot',
    pathMatch: 'full'
  },
  {
    path: 'robot',
    component: RobotComponent,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: RobotInfoComponent
      },
      {
        path: 'capteurs',
        component: CapteursComponent
      },
      {
        path: 'servos',
        component: ServosComponent
      },
      {
        path: 'mouvement',
        component: MouvementsComponent
      },
      {
        path: 'map',
        component: MapComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];
