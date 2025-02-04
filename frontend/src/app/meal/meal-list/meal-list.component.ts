import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MealsStore } from '../meal.store';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [],
  providers: [MealsStore],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealListComponent {
  readonly store = inject(MealsStore);
  readonly meals = this.store.meals;
}
