import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { router } from "expo-router";
import { cameraStyles } from "styles";
import { EdamamService } from "services/edamamService";
import { BarcodeResult } from "types/edamam";
import { ScannedProductStorage } from "services/scannedProductStorage";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarcodeResult) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      const response = await EdamamService.searchByBarcode(data);

      if (response.hints && response.hints.length > 0) {
        const food = response.hints[0].food;
        Alert.alert(
          "Produit trouvé !",
          `${food.label}${food.brand ? ` - ${food.brand}` : ""}\n${Math.round(
            food.nutrients.ENERC_KCAL || 0
          )} calories`,
          [
            {
              text: "Annuler",
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
            {
              text: "Ajouter",
              onPress: async () => {
                const productData = {
                  foodId: food.foodId,
                  label: food.label,
                  brand: food.brand,
                  image: food.image,
                  calories: food.nutrients.ENERC_KCAL || 0,
                  proteins: food.nutrients.PROCNT,
                  carbs: food.nutrients.CHOCDF,
                  fats: food.nutrients.FAT,
                };

                await ScannedProductStorage.add(productData);

                setScanned(false);
                setIsProcessing(false);

                Alert.alert(
                  "Produit ajouté !",
                  `${productData.label} a été ajouté à votre liste. Vous pouvez scanner un autre produit ou retourner à l'ajout de repas.`,
                  [
                    {
                      text: "Scanner encore",
                    },
                    {
                      text: "Voir la liste",
                      onPress: () => {
                        router.replace("/(main)/add");
                      },
                    },
                  ]
                );
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Produit non trouvé",
          "Ce code-barres ne correspond à aucun aliment dans notre base de données.",
          [
            {
              text: "Réessayer",
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de rechercher ce produit. Vérifiez votre connexion.",
        [
          {
            text: "Réessayer",
            onPress: () => {
              setScanned(false);
              setIsProcessing(false);
            },
          },
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={cameraStyles.container}>
        <Text style={cameraStyles.instructionText}>
          Demande d'autorisation pour la caméra...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={cameraStyles.container}>
        <Text style={cameraStyles.instructionText}>
          L'accès à la caméra est nécessaire pour scanner les codes-barres
        </Text>
        <TouchableOpacity
          style={cameraStyles.backButton}
          onPress={() => router.replace("/(main)/add")}
        >
          <Text style={cameraStyles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={cameraStyles.container}>
      <CameraView
        style={cameraStyles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
        }}
      >
        <View style={cameraStyles.overlay}>
          <TouchableOpacity
            style={cameraStyles.backButton}
            onPress={() => router.replace("/(main)/add")}
          >
            <Text style={cameraStyles.backButtonText}>← Retour</Text>
          </TouchableOpacity>

          <View style={cameraStyles.scanArea} />

          <Text style={cameraStyles.instructionText}>
            {isProcessing
              ? "Recherche en cours..."
              : "Scannez plusieurs codes-barres puis appuyez sur Terminer"}
          </Text>

          <TouchableOpacity
            style={cameraStyles.finishButton}
            onPress={() => router.replace("/(main)/add")}
          >
            <Text style={cameraStyles.finishButtonText}>Terminer le scan</Text>
          </TouchableOpacity>

          {scanned && (
            <TouchableOpacity
              style={cameraStyles.resultContainer}
              onPress={() => {
                setScanned(false);
                setIsProcessing(false);
              }}
            >
              <Text style={cameraStyles.resultText}>
                Appuyez pour scanner à nouveau
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;
