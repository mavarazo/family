import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Meal } from './meal.models';
import { MealService } from './meal.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type MealsState = {
  meals: Meal[];
};

const initialState: MealsState = {
  meals: [],
};

export const MealsStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _mealService: inject(MealService),
  })),
  withMethods((store) => ({
    getMeals: rxMethod<void>(
      pipe(
        switchMap(() =>
          store._mealService.getMeals().pipe(
            tapResponse({
              next: (meals: Meal[]) => {
                patchState(store, { meals: meals });
              },
              error: () => {
                console.error('Error loading meals');
              },
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.getMeals();
    },
  })
);
