import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { DbMeal, DbFood } from "../../types/database";

interface MealCardProps {
  meal: DbMeal & { foods: DbFood[] };
  onPress?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealImage = () => {
    if (meal.foods.length === 1) {
      const singleFood = meal.foods[0];
      if (singleFood.image) {
        return { uri: singleFood.image };
      }
    }
    return require("../../assets/repas.png");
  };

  const totalProteins = meal.foods.reduce(
    (sum, food) => sum + (food.proteins || 0),
    0
  );
  const totalCarbs = meal.foods.reduce(
    (sum, food) => sum + (food.carbs || 0),
    0
  );
  const totalFats = meal.foods.reduce((sum, food) => sum + (food.fats || 0), 0);

  const mealName =
    meal.foods.length > 0
      ? meal.foods
          .slice(0, 2)
          .map((food) => food.name)
          .join(", ") +
        (meal.foods.length > 2 ? ` +${meal.foods.length - 2}` : "")
      : "Repas";

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#f0f0f0",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: "500",
            }}
          >
            {meal.foods.length} ingrédient{meal.foods.length > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Image
          source={getMealImage()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
          }}
          defaultSource={require("../../assets/repas.png")}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#333",
            lineHeight: 20,
            flex: 1,
          }}
        >
          {mealName}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#f8f9fa",
          padding: 12,
          borderRadius: 12,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {Math.round(meal.totalCalories)}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              marginTop: 2,
            }}
          >
            Kcal
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {Math.round(totalProteins * 10) / 10}g
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              marginTop: 2,
            }}
          >
            Protein
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {Math.round(totalFats * 10) / 10}g
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              marginTop: 2,
            }}
          >
            Fat
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {Math.round(totalCarbs * 10) / 10}g
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              marginTop: 2,
            }}
          >
            Carbs
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 12,
          color: "#999",
          marginTop: 8,
          textAlign: "right",
        }}
      >
        {formatDate(meal.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};
