import { Inject, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../shared/request-status.feature';
import { Router } from '@angular/router';
import { Meal, Mealdate, ModifiableMealdate } from './mealdate.models';
import { MealdateService } from './mealdate.service';
import { MealService } from './meal.service';

type MealdateState = {
  mealdates: Mealdate[];
  meals: Meal[];
  mealdate: Mealdate | undefined;
};

const initialState: MealdateState = {
  mealdates: [],
  meals: [],
  mealdate: undefined,
};

export const MealdateStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withProps(() => ({
    mealdateService: inject(MealdateService),
    mealService: inject(MealService),
    router: inject(Router),
  })),
  withMethods((store) => ({
    getMealdates: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap(() =>
          store.mealdateService.getMealdates().pipe(
            tapResponse({
              next: (mealdates: Mealdate[]) => {
                patchState(
                  store,
                  {
                    mealdates: mealdates,
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

    addMealdate: rxMethod<ModifiableMealdate>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((mealdate) =>
          store.mealdateService.addMealdate(mealdate).pipe(
            tapResponse({
              next: (mealdate) => {
                patchState(
                  store,
                  (state) => ({
                    mealdates: [...state.mealdates, mealdate],
                  }),
                  setFulfilled()
                );
                store.router.navigate(['mealdates']);
              },
              error: (err: string) => {
                patchState(store, setError(err));
              },
            })
          )
        )
      )
    ),

    getMealdate: rxMethod<number>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((mealdateId) =>
          store.mealdateService.getMealdate(mealdateId).pipe(
            tapResponse({
              next: (mealdate) =>
                patchState(store, { mealdate: mealdate }, setFulfilled),
              error: (err: string) => patchState(store, setError(err)),
            })
          )
        )
      )
    ),

    changeMealdate: rxMethod<{ id: number; mealdate: ModifiableMealdate }>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((model) =>
          store.mealdateService.changeMealdate(model.id, model.mealdate).pipe(
            tapResponse({
              next: (mealdate) => {
                const mealdates = [...store.mealdates()];
                const index = mealdates.findIndex((x) => x.ID === mealdate.ID);

                mealdates[index] = mealdate;

                patchState(
                  store,
                  {
                    mealdates: mealdates,
                  },
                  setFulfilled()
                );

                store.router.navigate(['mealdates']);
              },
              error: (err: string) => patchState(store, setError(err)),
            })
          )
        )
      )
    ),

    removeMealdate: rxMethod<Mealdate>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap((mealdate) =>
          store.mealdateService.removeMealdate(mealdate).pipe(
            tapResponse({
              next: () => {
                patchState(
                  store,
                  {
                    mealdates: [
                      ...store.mealdates().filter((x) => x.ID !== mealdate.ID),
                    ],
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
  })),
  withHooks({
    onInit(store) {
      store.getMealdates();
      store.getMeals();
    },
  })
);
