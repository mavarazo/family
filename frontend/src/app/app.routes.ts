import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'meals',
    loadChildren: () => import('./meal/meal.routes').then((m) => m.MEAL_ROUTES),
  },
  {
    path: 'mealdates',
    loadChildren: () =>
      import('./mealdate/mealdate.routes').then((m) => m.MEALDATE_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'meals',
  },
];
