export interface DbMeal {
  id: number;
  date: string;
  totalCalories: number;
  createdAt: string;
}

export interface DbFood {
  id: number;
  mealId: number;
  name: string;
  brand?: string;
  image?: string;
  calories: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  quantity: number;
  measure: string;
  isScanned: boolean
}

export interface CreateMealData {
  date: string;
  totalCalories: number;
  foods: Omit<DbFood, 'id' | 'mealId'>[];
}
