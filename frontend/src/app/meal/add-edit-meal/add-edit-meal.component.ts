import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MealStore } from '../meal.store';
import { Meal, ModifiableMeal } from '../meal.models';

@Component({
  selector: 'app-add-edit-meal',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [MealStore],
  templateUrl: './add-edit-meal.component.html',
  styleUrl: './add-edit-meal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditMealComponent {
  readonly store = inject(MealStore);
  readonly mealId = input<number>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl(''),
    notes: new FormControl(''),
  });

  constructor() {
    effect(() => {
      const id = this.mealId();
      if (id) {
        this.store.getMeal(id);
      }
    });

    effect(() => {
      const meal = this.store.meal();
      if (meal) {
        this.form.patchValue(meal);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const id = this.mealId();
    const meal: ModifiableMeal = Object.assign(this.form.value);
    if (id) {
      this.store.changeMeal({ id, meal });
    } else {
      this.store.addMeal(meal);
    }
  }
}
