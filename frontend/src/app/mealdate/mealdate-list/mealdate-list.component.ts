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
import { DatePipe, KeyValuePipe } from '@angular/common';
import { signalMethod } from '@ngrx/signals';
import { format } from 'date-fns';

@Component({
  selector: 'app-mealdate-list',
  standalone: true,
  imports: [RouterLink, DatePipe, KeyValuePipe],
  providers: [MealdateStore],
  templateUrl: './mealdate-list.component.html',
  styleUrl: './mealdate-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealdateListComponent {
  readonly store = inject(MealdateStore);
  readonly mealdates = this.store.mealdatesGroupedByPlannedAt;
  readonly from = this.store.filter.from;
  readonly upto = this.store.filter.upto;

  readonly loadMealdates = signalMethod(() => this.store.getMealdates());

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
