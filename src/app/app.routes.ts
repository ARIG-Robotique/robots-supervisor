import {Routes} from '@angular/router';
import {ControlsComponent} from './views/controls/controls.component';
import {RobotComponent} from './views/robot/robot.component';
import {MapComponent} from './views/map/map.component';
import {AdminComponent} from './views/admin/admin.component';
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
        path     : 'controls',
        component: ControlsComponent
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
