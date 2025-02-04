export interface Meal {
  id: number;
  name: string;
  link?: string;
  description?: string;
}

export interface ModifiableMeal {
  name: string;
  link?: string;
  description?: string;
}
