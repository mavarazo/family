import { Component, effect, inject } from '@angular/core';
import { MealdateStore } from '../mealdate.store';
import { Router, RouterLink } from '@angular/router';
import { Mealdate } from '../mealdate.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mealdate-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  providers: [MealdateStore],
  templateUrl: './mealdate-list.component.html',
  styleUrl: './mealdate-list.component.scss',
})
export class MealdateListComponent {
  readonly store = inject(MealdateStore);
  readonly mealdates = this.store.mealdates;

  constructor(private router: Router) {
    effect(() => {
      this.mealdates().forEach((mealdate) =>
        console.log(JSON.stringify(mealdate))
      );
    });
  }

  remove(mealdate: Mealdate) {
    this.store.removeMealdate(mealdate);
  }
}
