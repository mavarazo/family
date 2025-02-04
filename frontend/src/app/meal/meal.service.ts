import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal } from './meal.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private http: HttpClient) {}

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${environment.apiUrl}/api/meals/`);
  }
}
