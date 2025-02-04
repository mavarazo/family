import { Inject, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Meal, ModifiableMeal } from './meal.models';
import { MealService } from './meal.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './request-status.feature';
import { Router } from '@angular/router';

type MealState = {
  meals: Meal[];
  meal: Meal | undefined;
};

const initialState: MealState = {
  meals: [],
  meal: undefined,
};

export const MealStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withProps(() => ({
    mealService: inject(MealService),
    router: inject(Router),
  })),
  withMethods((store) => ({
    getMeals: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap(() =>
          store.mealService.getMeals().pipe(
            tapResponse({
              next: (meals: Meal[]) => {
                patchState(
                  store,
                  {
                    meals: meals,
                  },
                  setFulfilled()
                );
              },
              error: (err: string) => {
                patchState(store, setError(err));
              },
            })
          )
        )
      )
    ),

    addMeal: rxMethod<ModifiableMeal>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((meal) =>
          store.mealService.addMeal(meal).pipe(
            tapResponse({
              next: (meal) => {
                patchState(
                  store,
                  (state) => ({
                    meals: [...state.meals, meal],
                  }),
                  setFulfilled()
                );
                store.router.navigate(['meals']);
              },
              error: (err: string) => {
                patchState(store, setError(err));
              },
            })
          )
        )
      )
    ),

    getMeal: rxMethod<number>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((mealId) =>
          store.mealService.getMeal(mealId).pipe(
            tapResponse({
              next: (meal) => patchState(store, { meal: meal }, setFulfilled),
              error: (err: string) => patchState(store, setError(err)),
            })
          )
        )
      )
    ),

    changeMeal: rxMethod<{ id: number; meal: ModifiableMeal }>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((model) =>
          store.mealService.changeMeal(model.id, model.meal).pipe(
            tapResponse({
              next: (meal) => {
                const meals = [...store.meals()];
                const index = meals.findIndex((x) => x.id === meal.id);

                meals[index] = meal;

                patchState(
                  store,
                  {
                    meals: meals,
                  },
                  setFulfilled()
                );

                store.router.navigate(['meals']);
              },
              error: (err: string) => patchState(store, setError(err)),
            })
          )
        )
      )
    ),

    removeMeal: rxMethod<Meal>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((meal) =>
          store.mealService.removeMeal(meal).pipe(
            tapResponse({
              next: () => {
                patchState(
                  store,
                  {
                    meals: [...store.meals().filter((x) => x.id !== meal.id)],
                  },
                  setFulfilled()
                );
              },
              error: (err: string) => {
                patchState(store, setError(err));
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
