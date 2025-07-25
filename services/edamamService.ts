import { EdamamResponse, AutocompleteResponse } from '../types/edamam';
import EDAMAM_CONFIG from '../config/edamam';

export class EdamamService {
    static async searchFood(query: string): Promise<EdamamResponse> {
        try {

            const url = `${EDAMAM_CONFIG.BASE_URL}/parser`
                + `?ingr=${encodeURIComponent(query)}`
                + `&app_id=${EDAMAM_CONFIG.APP_ID}`
                + `&app_key=${EDAMAM_CONFIG.APP_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${url}`);
            }

            const data: EdamamResponse = await response.json();
            return data;
        } catch (error) {
            // console.error('Erreur lors de la recherche d\'aliments:', error);
            throw error;
        }
    }

    static async searchByBarcode(barcode: string): Promise<EdamamResponse> {
        try {
            const url = `${EDAMAM_CONFIG.BASE_URL}/parser?upc=${barcode}&app_id=${EDAMAM_CONFIG.APP_ID}&app_key=${EDAMAM_CONFIG.APP_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EdamamResponse = await response.json();
            return data;
        } catch (error) {
            // console.error('Erreur lors de la recherche par code-barres:', error);
            throw error;
        }
    }

    static async getAutocompletions(query: string): Promise<AutocompleteResponse> {
        try {
            // Test avec l'URL de base food-database d'abord
            const url = `${EDAMAM_CONFIG.AUTOCOMPLETE_URL}`
                + `?q=${encodeURIComponent(query)}`
                + `&app_id=${EDAMAM_CONFIG.APP_ID}`
                + `&app_key=${EDAMAM_CONFIG.APP_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur réponse:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data: AutocompleteResponse = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur lors de l\'autocomplétion:', error);
            throw error;
        }
    }
}
