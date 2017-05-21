import {Routes} from '@angular/router';
import {MouvementsComponent} from './mouvements/mouvements.component';
import {ServosComponent} from './servos/servos.component';
import {RobotComponent} from './robot/robot.component';
import {HomeComponent} from './home/home.component';
import {RobotResolve} from './resolvers/RobotResolve';
import {RobotInfoComponent} from './robot-info/robot-info.component';
import {MapComponent} from './map/map.component';
import {CapteursComponent} from './capteurs/capteurs.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
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