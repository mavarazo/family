export interface Meal {
  ID: number;
  name: string;
  link?: string;
  description?: string;
}

export interface ModifiableMeal {
  name: string;
  link?: string;
  description?: string;
}
