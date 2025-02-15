import {
  Component,
  effect,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MealdateStore } from '../mealdate.store';
import { Router, RouterLink } from '@angular/router';
import { Mealdate } from '../mealdate.models';
import { DatePipe } from '@angular/common';
import { signalMethod } from '@ngrx/signals';
import { format } from 'date-fns';

@Component({
  selector: 'app-mealdate-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  providers: [MealdateStore],
  templateUrl: './mealdate-list.component.html',
  styleUrl: './mealdate-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealdateListComponent {
  readonly store = inject(MealdateStore);
  readonly mealdates = this.store.mealdates;
  readonly from = this.store.filter.from;
  readonly upto = this.store.filter.upto;

  readonly loadMealdates = signalMethod(() => this.store.getMealdates());

  // readonly mealdatesGrouped = computed(() => {
  //   return this.store.mealdates().reduce((store, value) => {
  //     const plannedAt = format(value.plannedAt, 'yyyy-MM-dd');
  //     if (!store.has(plannedAt)) {
  //       store.set(plannedAt, [value]);
  //     } else {
  //       const values = store.get(plannedAt);
  //       if (values) {
  //         values.push(value);
  //       }
  //     }
  //     return store;
  //   }, new Map<string, Mealdate[]>());
  // });

  constructor(private router: Router) {
    this.loadMealdates(this.store.filter);
  }

  prevWeek() {
    this.store.prevWeek();
  }

  nextWeek() {
    this.store.nextWeek();
  }

  remove(mealdate: Mealdate) {
    this.store.removeMealdate(mealdate);
  }
}
