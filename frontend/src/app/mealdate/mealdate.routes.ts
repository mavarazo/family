import { Routes } from '@angular/router';
import { MealdateListComponent } from './mealdate-list/mealdate-list.component';
import { AddEditMealdateComponent } from './add-edit-mealdate/add-edit-mealdate.component';
import { MealdateComponent } from './mealdate/mealdate.component';

export const MEALDATE_ROUTES: Routes = [
  {
    path: '',
    component: MealdateListComponent,
  },
  {
    path: 'add',
    component: AddEditMealdateComponent,
  },
  {
    path: ':mealdateId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MealdateComponent,
      },
      {
        path: 'edit',
        pathMatch: 'full',
        component: AddEditMealdateComponent,
      },
    ],
  },
];
