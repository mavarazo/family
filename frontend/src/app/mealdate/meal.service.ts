import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Meal } from './mealdate.models';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private http: HttpClient) {}

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${environment.apiUrl}/api/meals/`);
  }

  getMeal(id: number): Observable<Meal> {
    return this.http.get<Meal>(`${environment.apiUrl}/api/meals/${id}`);
  }
}
