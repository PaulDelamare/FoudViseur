import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { addMealStyles, inputStyles } from "styles";
import { EdamamHint, SelectedMeal } from "types/edamam";
import { EdamamService } from "services/edamamService";
import { useDebounce } from "hooks/useDebounce";
import { databaseService } from "services/databaseService";
import { CreateMealData } from "types/database";
import { Ionicons } from "@expo/vector-icons";
import { ScannedProductStorage } from "services/scannedProductStorage";

const AddMealScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EdamamHint[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Recherche automatique avec debounce
  useEffect(() => {
    const autoSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await EdamamService.searchFood(debouncedSearchQuery);
        setSearchResults(response.hints || []);
      } catch (error) {
        console.error("Erreur lors de la recherche automatique:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    autoSearch();
  }, [debouncedSearchQuery]);

  // Gérer les produits scannés avec AsyncStorage
  useEffect(() => {
    const loadScannedProducts = async () => {
      const scannedProducts = await ScannedProductStorage.getAll();
      if (scannedProducts.length > 0) {
        const scannedMeals: SelectedMeal[] = scannedProducts.map((product) => ({
          id: `scanned-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}-${product.foodId}`,
          name: product.label,
          brand: product.brand,
          image: product.image,
          calories: product.calories,
          proteins: product.proteins,
          carbs: product.carbs,
          fats: product.fats,
          quantity: 1,
          measure: "portion",
          isScanned: true,
        }));

        setSelectedMeals((prev) => [...prev, ...scannedMeals]);

        await ScannedProductStorage.clear();
      }
    };

    loadScannedProducts();
  }, []);

  const addMealToSelection = (hint: EdamamHint, isScanned: boolean = false) => {
    const meal: SelectedMeal = {
      id: `${hint.food.foodId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      name: hint.food.label,
      brand: hint.food.brand,
      image: hint.food.image,
      calories: hint.food.nutrients.ENERC_KCAL || 0,
      proteins: hint.food.nutrients.PROCNT,
      carbs: hint.food.nutrients.CHOCDF,
      fats: hint.food.nutrients.FAT,
      quantity: 1,
      measure: hint.measures[0]?.label || "portion",
      isScanned,
    };
    setSelectedMeals((prev) => [...prev, meal]);
  };

  const removeMealFromSelection = (id: string) => {
    setSelectedMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
  };

  const openBarcodeScanner = () => {
    router.replace("/(main)/add/camera");
  };

  const validateMeal = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert("Attention", "Veuillez sélectionner au moins un aliment.");
      return;
    }

    const totalCalories = selectedMeals.reduce(
      (sum, meal) => sum + meal.calories,
      0
    );

    try {
      const mealData: CreateMealData = {
        date: new Date().toISOString().split("T")[0],
        totalCalories,
        foods: selectedMeals.map((meal) => ({
          name: meal.name,
          brand: meal.brand,
          image: meal.image,
          calories: meal.calories,
          proteins: meal.proteins,
          carbs: meal.carbs,
          fats: meal.fats,
          quantity: meal.quantity,
          measure: meal.measure,
          isScanned: meal.isScanned,
        })),
      };

      await databaseService.createMeal(mealData);

      Alert.alert(
        "Repas sauvegardé !",
        `Votre repas de ${Math.round(
          totalCalories
        )} calories a été enregistré avec succès.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedMeals([]);
              setSearchResults([]);
              setSearchQuery("");
              router.replace("/(main)/(home)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert(
        "Erreur",
        "Impossible de sauvegarder le repas. Veuillez réessayer.",
        [
          {
            text: "OK",
          },
        ]
      );
    }
  };

  const renderFoodItem = ({ item }: { item: EdamamHint }) => {
    return (
      <View style={addMealStyles.resultItem}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#f0f0f0",
              marginRight: 12,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.food.image ? (
              <Image
                source={{ uri: item.food.image }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
            ) : (
              <Text style={{ fontSize: 18 }}>🍽️</Text>
            )}
          </View>

          <View style={addMealStyles.resultInfo}>
            <Text style={addMealStyles.resultName}>{item.food.label}</Text>
            {item.food.brand && (
              <Text style={addMealStyles.resultBrand}>{item.food.brand}</Text>
            )}
            <Text style={addMealStyles.resultCalories}>
              {Math.round(item.food.nutrients.ENERC_KCAL || 0)} cal
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={addMealStyles.addButton}
          onPress={() => addMealToSelection(item)}
        >
          <Text style={addMealStyles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedMeal = ({ item }: { item: SelectedMeal }) => (
    <View style={addMealStyles.selectedMealItem}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#f0f0f0",
            marginRight: 8,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
            />
          ) : (
            <Text style={{ fontSize: 14 }}>{item.isScanned ? "📷" : "🍽️"}</Text>
          )}
        </View>

        <Text style={addMealStyles.selectedMealText}>
          {item.name} - {Math.round(item.calories)} cal
          {item.brand && ` (${item.brand})`}
        </Text>
      </View>

      <TouchableOpacity
        style={addMealStyles.removeButton}
        onPress={() => removeMealFromSelection(item.id)}
      >
        <Text style={addMealStyles.removeButtonText}>Retirer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <View>
        <View
          style={{ ...addMealStyles.searchContainer, flexDirection: "column" }}
        >
          <View
            style={{
              ...addMealStyles.searchInputContainer,
            }}
          >
            <TextInput
              style={{
                ...inputStyles.input,
                ...(searchFocused && inputStyles.inputFocused),
              }}
              placeholder="Rechercher un aliment..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#000002",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={openBarcodeScanner}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera-outline" color="#fff" size={24} />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Scanner</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {selectedMeals.length > 0 && (
        <View style={addMealStyles.selectedMealsContainer}>
          <Text style={addMealStyles.selectedMealsTitle}>
            Aliments sélectionnés :
          </Text>
          <FlatList
            data={selectedMeals}
            renderItem={renderSelectedMeal}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <View style={addMealStyles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item, index) => `${item.food.foodId}-${index}`}
            showsVerticalScrollIndicator={false}
          />
        ) : searchQuery && !isLoading ? (
          <Text style={addMealStyles.emptyText}>Aucun résultat trouvé</Text>
        ) : null}
      </View>

      {selectedMeals.length > 0 && (
        <TouchableOpacity
          style={addMealStyles.validateButton}
          onPress={validateMeal}
        >
          <Text style={addMealStyles.validateButtonText}>
            Valider le repas ({selectedMeals.length} aliment
            {selectedMeals.length > 1 ? "s" : ""})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddMealScreen;
