import { Routes } from '@angular/router';
import { AdminComponent } from './views/admin/admin.component';
import { MapComponent } from './views/map/map.component';

export const AppRoutes: Routes = [
  {
    path     : '',
    component: MapComponent,
  },
  {
    path     : 'admin',
    component: AdminComponent
  }
];
