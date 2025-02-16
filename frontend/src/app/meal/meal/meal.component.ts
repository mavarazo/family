import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { MealStore } from '../meal.store';
import { signalMethod } from '@ngrx/signals';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [],
  providers: [MealStore],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealComponent {
  mealId = input.required<number>();

  readonly store = inject(MealStore);
  readonly meal = this.store.meal;

  constructor() {
    effect(() => this.store.getMeal(this.mealId()));
  }
}
