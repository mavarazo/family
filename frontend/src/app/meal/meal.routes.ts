import { Routes } from '@angular/router';
import { MealListComponent } from './meal-list/meal-list.component';
import { AddEditMealComponent } from './add-edit-meal/add-edit-meal.component';

export const MEAL_ROUTES: Routes = [
  {
    path: '',
    component: MealListComponent,
  },
  {
    path: 'add',
    component: AddEditMealComponent,
  },
  {
    path: ':mealId',
    children: [
      {
        path: 'edit',
        pathMatch: 'full',
        component: AddEditMealComponent,
      },
    ],
  },
];
