export enum MealdateType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
}

export interface Mealdate {
  ID: number;
  date: Date;
  type: MealdateType;
  meal: Meal;
  notes?: string;
}

export interface ModifiableMealdate {
  date: Date;
  type: MealdateType;
  meal: Meal;
  notes?: string;
}

export interface Meal {
  ID: number;
  name: string;
}
