export interface Meal {
  ID: number;
  name: string;
  link?: string;
  notes?: string;
}

export interface ModifiableMeal {
  name: string;
  link?: string;
  notes?: string;
}
