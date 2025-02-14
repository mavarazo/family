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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-edit-meal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  providers: [MealStore],
  templateUrl: './add-edit-meal.component.html',
  styleUrl: './add-edit-meal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditMealComponent {
  readonly store = inject(MealStore);
  readonly mealId = input<number>();

  formSubmitAttempt: boolean = false;

  form = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    link: new FormControl<string | undefined>(undefined),
    notes: new FormControl<string | undefined>(undefined),
  });

  get name() {
    return this.form.get('name');
  }

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
    this.formSubmitAttempt = true;

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
