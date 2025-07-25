export interface EdamamFood {
    foodId: string;
    uri?: string;
    label: string;
    knownAs?: string;
    brand?: string;
    category?: string;
    categoryLabel?: string;
    foodContentsLabel?: string;
    image?: string;
    nutrients: {
        ENERC_KCAL?: number;
        PROCNT?: number;
        FAT?: number;
        CHOCDF?: number;
        FIBTG?: number;
        [key: string]: number | undefined;
    };
    servingSizes?: Array<{
        uri: string;
        label: string;
        quantity: number;
    }>;
    servingsPerContainer?: number;
}

export interface EdamamHint {
    food: EdamamFood;
    measures: EdamamMeasure[];
}

export interface EdamamMeasure {
    uri: string;
    label: string;
    weight: number;
}

export interface EdamamResponse {
    text: string;
    parsed: any[];
    hints: EdamamHint[];
}

export interface SelectedMeal {
    id: string;
    name: string;
    brand?: string;
    image?: string;
    calories: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
    quantity: number;
    measure: string;
    isScanned: boolean;
}

export interface BarcodeResult {
    type: string;
    data: string;
}

export type AutocompleteResponse = string[];
