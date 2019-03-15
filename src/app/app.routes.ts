import {Routes} from '@angular/router';
import {MouvementsComponent} from './views/mouvements/mouvements.component';
import {ServosComponent} from './views/servos/servos.component';
import {RobotComponent} from './views/robot/robot.component';
import {HomeComponent} from './views/home/home.component';
import {RobotResolve} from './resolvers/RobotResolve';
import {RobotInfoComponent} from './views/robot-info/robot-info.component';
import {MapComponent} from './views/map/map.component';
import {CapteursComponent} from './views/capteurs/capteurs.component';
import {AdminComponent} from "./components/admin/admin.component";

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'robot/:id',
    component: RobotComponent,
    resolve: {
      robot: RobotResolve
    },
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
  }
];
