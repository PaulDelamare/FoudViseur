import { useState, useEffect } from "react";
import { databaseService } from "../services/databaseService";
import { DbFood, DbMeal } from "../types/database";

export const useMeals = () => {
  const [meals, setMeals] = useState<(DbMeal & { foods: DbFood[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const recentMeals = await databaseService.getRecentMeals(20);
      setMeals(recentMeals);
    } catch (error) {
      console.error("Erreur lors du chargement des repas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const refreshMeals = () => {
    loadMeals();
  };

  return {
    meals,
    isLoading,
    refreshMeals,
  };
};
