import { computed, effect, Inject, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
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
import { addDays, endOfWeek, format, startOfWeek, subDays } from 'date-fns';

type MealdateState = {
  mealdates: Mealdate[];
  meals: Meal[];
  mealdate: Mealdate | undefined;
  filter: { from: Date; upto: Date };
};

const initialState: MealdateState = {
  mealdates: [],
  meals: [],
  mealdate: undefined,
  filter: {
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    upto: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
};

export const MealdateStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withProps(() => ({
    mealdateService: inject(MealdateService),
    mealService: inject(MealService),
    router: inject(Router),
  })),
  withComputed((store) => ({
    mealdatesGroupedByPlannedAt: computed(() => {
      return store.mealdates().reduce((store, value) => {
        const plannedAt = format(value.plannedAt, 'yyyy-MM-dd');
        if (!store.has(plannedAt)) {
          store.set(plannedAt, [value]);
        } else {
          const values = store.get(plannedAt);
          if (values) {
            values.push(value);
          }
        }
        return store;
      }, new Map<string, Mealdate[]>());
    }),
  })),
  withMethods((store) => ({
    getMealdates: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, setPending());
        }),
        switchMap(() =>
          store.mealdateService
            .getMealdates(store.filter.from(), store.filter.upto())
            .pipe(
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

    prevWeek: () => {
      const upto = subDays(store.filter.from(), 1);
      const from = startOfWeek(upto, { weekStartsOn: 1 });
      patchState(store, { filter: { from: from, upto: upto } });
    },

    nextWeek: () => {
      const from = addDays(store.filter.upto(), 1);
      const upto = endOfWeek(from, { weekStartsOn: 1 });
      patchState(store, { filter: { from: from, upto: upto } });
    },
  })),
  withHooks({
    onInit(store) {
      store.getMeals();
    },
  })
);
