import { Link } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { useMeals } from "../../../hooks/useMeals";
import { MealCard } from "../../../components/home/MealCard";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { router } from "expo-router";

export default function Page() {
  const { meals, isLoading, refreshMeals } = useMeals();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshMeals();
    }, [refreshMeals])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshMeals();
    setRefreshing(false);
  };

  return (
    <View style={[{ backgroundColor: "#f5f6fa", flex: 1 }]}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <Link href="/(main)/add" asChild>
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
            }}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 22,
                marginRight: 6,
              }}
            >
              +
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                letterSpacing: 0.5,
              }}
            >
              Nouveau repas
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#333",
            marginHorizontal: 24,
            marginBottom: 16,
          }}
        >
          Mes repas récents
        </Text>

        {meals.length === 0 && !isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Aucun repas enregistré pour le moment.{"\n"}
              Commencez par ajouter votre premier repas !
            </Text>
          </View>
        ) : (
          <FlatList
            data={meals}
            renderItem={({ item }) => (
              <MealCard
                meal={item}
                onPress={() => {
                  router.push(`/(main)/(home)/${item.id}`);
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
