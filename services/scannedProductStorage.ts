import AsyncStorage from '@react-native-async-storage/async-storage';

const SCANNED_PRODUCTS_KEY = '@scanned_products';

export interface ScannedProduct {
    foodId: string;
    label: string;
    brand?: string;
    image?: string;
    calories: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
}

export const ScannedProductStorage = {
    async add(product: ScannedProduct): Promise<void> {
        try {
            const existingProducts = await this.getAll();
            const updatedProducts = [...existingProducts, product];
            await AsyncStorage.setItem(SCANNED_PRODUCTS_KEY, JSON.stringify(updatedProducts));

        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit scanné:', error);
        }
    },

    async getAll(): Promise<ScannedProduct[]> {
        try {
            const productsJson = await AsyncStorage.getItem(SCANNED_PRODUCTS_KEY);
            if (productsJson) {
                return JSON.parse(productsJson);
            }
            return [];
        } catch (error) {
            console.error('Erreur lors de la récupération des produits scannés:', error);
            return [];
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(SCANNED_PRODUCTS_KEY);

        } catch (error) {
            console.error('Erreur lors de la suppression des produits scannés:', error);
        }
    },

    // Garder la compatibilité avec l'ancienne méthode save
    async save(product: ScannedProduct): Promise<void> {
        await this.add(product);
    },

    // Garder la compatibilité avec l'ancienne méthode get (retourne le premier produit)
    async get(): Promise<ScannedProduct | null> {
        const products = await this.getAll();
        return products.length > 0 ? products[0] : null;
    }
};
