import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mealdate, ModifiableMealdate } from './mealdate.models';

@Injectable({
  providedIn: 'root',
})
export class MealdateService {
  constructor(private http: HttpClient) {}

  getMealdates(): Observable<Mealdate[]> {
    return this.http.get<Mealdate[]>(`${environment.apiUrl}/api/mealdates/`);
  }

  addMealdate(mealdate: ModifiableMealdate): Observable<Mealdate> {
    return this.http.post<Mealdate>(
      `${environment.apiUrl}/api/mealdates/`,
      mealdate
    );
  }

  getMealdate(id: number): Observable<Mealdate> {
    return this.http.get<Mealdate>(`${environment.apiUrl}/api/mealdates/${id}`);
  }

  changeMealdate(
    id: number,
    mealdate: ModifiableMealdate
  ): Observable<Mealdate> {
    return this.http.put<Mealdate>(
      `${environment.apiUrl}/api/mealdates/${id}`,
      mealdate
    );
  }

  removeMealdate(mealdate: Mealdate): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/mealdates/${mealdate.ID}`
    );
  }
}
