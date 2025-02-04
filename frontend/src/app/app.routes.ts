import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'meals',
        loadChildren: () => import('./meal/meal.routes').then(m => m.MEALS_ROUTES)
    }
];
