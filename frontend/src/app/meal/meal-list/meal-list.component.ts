import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MealStore } from '../meal.store';
import { Router, RouterLink } from '@angular/router';
import { Meal } from '../meal.models';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [RouterLink],
  providers: [MealStore],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealListComponent {
  readonly store = inject(MealStore);
  readonly meals = this.store.meals;

  constructor(private router: Router) {}

  remove(meal: Meal) {
    this.store.removeMeal(meal);
  }
}
