import { Component, effect, inject, input } from '@angular/core';
import { MealdateStore } from '../mealdate.store';
import {
  Meal,
  Mealdate,
  MealdateType,
  ModifiableMealdate,
} from '../mealdate.models';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-mealdate',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, KeyValuePipe, RouterLink],
  providers: [MealdateStore],
  templateUrl: './add-edit-mealdate.component.html',
  styleUrl: './add-edit-mealdate.component.scss',
})
export class AddEditMealdateComponent {
  readonly store = inject(MealdateStore);
  readonly mealdateId = input<number>();

  readonly mealdateType = MealdateType;
  readonly meals = this.store.meals;

  formSubmitAttempt: boolean = false;

  readonly form = new FormGroup({
    date: new FormControl<Date | undefined>(undefined, Validators.required),
    type: new FormControl<MealdateType | undefined>(
      undefined,
      Validators.required
    ),
    meal: new FormControl<Meal | undefined>(undefined, Validators.required),
    notes: new FormControl<string | undefined>(undefined),
  });

  get date() {
    return this.form.get('date');
  }

  get type() {
    return this.form.get('type');
  }

  get meal() {
    return this.form.get('meal');
  }

  constructor() {
    effect(() => {
      const id = this.mealdateId();
      if (id) {
        this.store.getMealdate(id);
      }
    });

    effect(() => {
      const mealdate = this.store.mealdate();
      if (mealdate) {
        this.form.patchValue(mealdate);
        this.form.controls.meal.setValue(
          this.meals().find((meal) => meal.ID == mealdate.meal.ID)
        );
        this.form.markAsPristine();
      }
    });
  }

  submit() {
    this.formSubmitAttempt = true;

    if (this.form.invalid) {
      return;
    }

    const id = this.mealdateId();

    const mealdate: ModifiableMealdate = Object.assign(this.form.value);
    // console.log(JSON.stringify(mealdate));
    if (id) {
      this.store.changeMealdate({ id, mealdate });
    } else {
      this.store.addMealdate(mealdate);
    }
  }
}
