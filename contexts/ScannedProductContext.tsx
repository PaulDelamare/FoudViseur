import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScannedProduct {
  foodId: string;
  label: string;
  brand?: string;
  image?: string;
  calories: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

interface ScannedProductContextType {
  scannedProduct: ScannedProduct | null;
  setScannedProduct: (product: ScannedProduct | null) => void;
  clearScannedProduct: () => void;
}

const ScannedProductContext = createContext<ScannedProductContextType | undefined>(undefined);

interface ScannedProductProviderProps {
  children: ReactNode;
}

export const ScannedProductProvider: React.FC<ScannedProductProviderProps> = ({ children }) => {
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);

  const clearScannedProduct = () => {
    setScannedProduct(null);
  };

  return (
    <ScannedProductContext.Provider 
      value={{ 
        scannedProduct, 
        setScannedProduct, 
        clearScannedProduct 
      }}
    >
      {children}
    </ScannedProductContext.Provider>
  );
};

export const useScannedProduct = () => {
  const context = useContext(ScannedProductContext);
  if (context === undefined) {
    throw new Error('useScannedProduct must be used within a ScannedProductProvider');
  }
  return context;
};

export type { ScannedProduct };
