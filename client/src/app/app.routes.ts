import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'truck-search',
    pathMatch: 'full',
  },
  {
    path: 'truck-search',
    loadComponent: () =>
      import('../pages/truck-search/truck-search.component').then(
        (m) => m.TruckSearchComponent
      ),
  },
];
