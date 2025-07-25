import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../../services/databaseService';
import { DbMeal, DbFood } from '../../../types/database';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<(DbMeal & { foods: DbFood[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMealDetail();
  }, [id]);

  const loadMealDetail = async () => {
    try {
      setIsLoading(true);
      
      if (!id || Array.isArray(id)) {
        throw new Error('ID du repas invalide');
      }

      const mealData = await databaseService.getMealById(Number(id));
      setMeal(mealData);

    } catch (error) {
      console.error('Erreur lors du chargement du repas:', error);
      Alert.alert(
        'Erreur', 
        'Impossible de charger les détails du repas. Veuillez réessayer.',
        [
          { 
            text: 'Retour', 
            onPress: () => router.back() 
          },
          {
            text: 'Réessayer',
            onPress: () => loadMealDetail()
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async () => {
    Alert.alert(
      'Supprimer le repas',
      'Êtes-vous sûr de vouloir supprimer ce repas ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await databaseService.deleteMeal(Number(id));
              Alert.alert(
                'Repas supprimé',
                'Le repas a été supprimé avec succès.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le repas');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNutrientColor = (type: string) => {
    switch (type) {
      case 'calories': return '#FF6B35';
      case 'proteins': return '#4ECDC4';
      case 'carbs': return '#45B7D1';
      case 'fats': return '#F7DC6F';
      default: return '#95A5A6';
    }
  };

  const renderFoodItem = (food: DbFood) => (
    <View
      key={food.id}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#f0f0f0',
            marginRight: 12,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {food.image ? (
            <Image
              source={{ uri: food.image }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <Text style={{ fontSize: 20 }}>{food.isScanned ? '📷' : '🍽️'}</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#2C3E50',
              marginBottom: 2,
            }}
          >
            {food.name}
          </Text>
          {food.brand && (
            <Text style={{ fontSize: 14, color: '#7F8C8D', marginBottom: 4 }}>
              {food.brand}
            </Text>
          )}
          <Text style={{ fontSize: 12, color: '#95A5A6' }}>
            {food.quantity} {food.measure}
            {food.isScanned && ' (Scanné)'}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#F8F9FA',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: getNutrientColor('calories'),
            }}
          >
            {Math.round(food.calories)}
          </Text>
          <Text style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>
            kcal
          </Text>
        </View>

        {food.proteins !== null && (
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: getNutrientColor('proteins'),
              }}
            >
              {Math.round((food.proteins || 0) * 10) / 10}g
            </Text>
            <Text style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>
              Protéines
            </Text>
          </View>
        )}

        {food.carbs !== null && (
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: getNutrientColor('carbs'),
              }}
            >
              {Math.round((food.carbs || 0) * 10) / 10}g
            </Text>
            <Text style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>
              Glucides
            </Text>
          </View>
        )}

        {food.fats !== null && (
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: getNutrientColor('fats'),
              }}
            >
              {Math.round((food.fats || 0) * 10) / 10}g
            </Text>
            <Text style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>
              Lipides
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={{ marginTop: 16, color: '#7F8C8D' }}>
            Chargement des détails...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#2C3E50',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            Repas introuvable
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#3498DB',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalProteins = meal.foods.reduce((sum, food) => sum + (food.proteins || 0), 0);
  const totalCarbs = meal.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
  const totalFats = meal.foods.reduce((sum, food) => sum + (food.fats || 0), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#E8EAED',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: '#F8F9FA',
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#2C3E50',
            flex: 1,
            textAlign: 'center',
            marginHorizontal: 16,
          }}
        >
          Détail du repas
        </Text>

        <TouchableOpacity
          onPress={deleteMeal}
          disabled={isDeleting}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: isDeleting ? '#F8F9FA' : '#FADBD8',
          }}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#E74C3C" />
          ) : (
            <Ionicons name="trash-outline" size={24} color="#E74C3C" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#2C3E50',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              {Math.round(meal.totalCalories)} kcal
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#7F8C8D',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {formatDate(meal.createdAt)}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#F8F9FA',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: getNutrientColor('proteins'),
                  }}
                >
                  {Math.round(totalProteins * 10) / 10}g
                </Text>
                <Text style={{ fontSize: 12, color: '#7F8C8D', marginTop: 4 }}>
                  Protéines
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: getNutrientColor('carbs'),
                  }}
                >
                  {Math.round(totalCarbs * 10) / 10}g
                </Text>
                <Text style={{ fontSize: 12, color: '#7F8C8D', marginTop: 4 }}>
                  Glucides
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: getNutrientColor('fats'),
                  }}
                >
                  {Math.round(totalFats * 10) / 10}g
                </Text>
                <Text style={{ fontSize: 12, color: '#7F8C8D', marginTop: 4 }}>
                  Lipides
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: 16,
              }}
            >
              Aliments ({meal.foods.length})
            </Text>

            {meal.foods.map(renderFoodItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
