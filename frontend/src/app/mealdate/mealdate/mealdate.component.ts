import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { MealdateStore } from '../mealdate.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mealdate',
  standalone: true,
  imports: [DatePipe],
  providers: [MealdateStore],
  templateUrl: './mealdate.component.html',
  styleUrl: './mealdate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealdateComponent {
  mealdateId = input.required<number>();

  readonly store = inject(MealdateStore);
  readonly mealdate = this.store.mealdate;

  constructor() {
    effect(() => this.store.getMealdate(this.mealdateId()));
  }
}
