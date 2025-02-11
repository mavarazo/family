import { Component, effect, inject, input } from '@angular/core';
import { MealdateStore } from '../mealdate.store';
import { Meal, MealdateType, ModifiableMealdate } from '../mealdate.models';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Select2,
  Select2Option,
  Select2UpdateEvent,
} from 'ng-select2-component';

@Component({
  selector: 'app-add-edit-mealdate',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, Select2, RouterLink],
  providers: [MealdateStore],
  templateUrl: './add-edit-mealdate.component.html',
  styleUrl: './add-edit-mealdate.component.scss',
})
export class AddEditMealdateComponent {
  readonly store = inject(MealdateStore);
  readonly mealdateId = input<number>();

  types: Select2Option[] = [];
  meals: Select2Option[] = [];

  form = new FormGroup({
    date: new FormControl<Date | null>(null, Validators.required),
    type: new FormControl<string | null>('', Validators.required),
    meal: new FormControl<Meal | null>(null, Validators.required),
    notes: new FormControl<string | null>(''),
  });

  get date() {
    return this.form.get('date');
  }

  constructor() {
    this.types = Object.entries(MealdateType).map(([key, value]) => {
      return { value: key, label: value } as Select2Option;
    });

    effect(() => {
      this.meals = this.store.meals().map((meal) => {
        return { value: meal, label: meal.name } as Select2Option;
      });
    });

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
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const id = this.mealdateId();
    const mealdate: ModifiableMealdate = Object.assign(this.form.value);

    if (id) {
      this.store.changeMealdate({ id, mealdate });
    } else {
      this.store.addMealdate(mealdate);
    }
  }
}
