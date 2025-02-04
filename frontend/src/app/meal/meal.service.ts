import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal, ModifiableMeal } from './meal.models';
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

  addMeal(meal: ModifiableMeal): Observable<Meal> {
    return this.http.post<Meal>(`${environment.apiUrl}/api/meals/`, meal);
  }

  getMeal(id: number): Observable<Meal> {
    return this.http.get<Meal>(`${environment.apiUrl}/api/meals/${id}`);
  }

  changeMeal(id: number, meal: ModifiableMeal): Observable<Meal> {
    return this.http.put<Meal>(`${environment.apiUrl}/api/meals/${id}`, meal);
  }

  removeMeal(meal: Meal): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/meals/${meal.id}`);
  }
}
