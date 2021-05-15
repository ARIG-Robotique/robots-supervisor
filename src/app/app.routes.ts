import { Routes } from '@angular/router';
import { AdminComponent } from './views/admin/admin.component';
import { ControlsComponent } from './views/controls/controls.component';
import { HomeComponent } from './views/home/home.component';
import { MapComponent } from './views/map/map.component';

export const AppRoutes: Routes = [
  {
    path     : '',
    component: HomeComponent,
  },
  {
    path     : 'controls',
    component: ControlsComponent
  },
  {
    path     : 'map',
    component: MapComponent
  },
  {
    path     : 'admin',
    component: AdminComponent
  }
];
