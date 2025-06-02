'use client';

import type { Product, StockMovement } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { formatISO } from 'date-fns';

interface StockContextType {
  products: Product[];
  movements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'currentStock'>) => Product;
  addStockEntry: (productId: string, quantity: number) => void;
  addStockWithdrawal: (productId:string, quantity: number, reason: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', name: 'Parafuso Sextavado M10', description: 'Parafuso de aço carbono M10x50mm', unit: 'un', minStockLevel: 50, currentStock: 120 },
  { id: '2', name: 'Arruela Lisa M10', description: 'Arruela de pressão para parafuso M10', unit: 'un', minStockLevel: 100, currentStock: 80 },
  { id: '3', name: 'Porca Sextavada M10', description: 'Porca de aço M10', unit: 'un', minStockLevel: 70, currentStock: 150 },
  { id: '4', name: 'Óleo Lubrificante XPTO', description: 'Óleo multiuso para máquinas', unit: 'frasco', minStockLevel: 10, currentStock: 5 },
];

const initialMovements: StockMovement[] = [
    { id: 'm1', productId: '1', productName: 'Parafuso Sextavado M10', type: 'entrada', quantity: 100, date: formatISO(new Date(2023, 10, 1)) },
    { id: 'm2', productId: '1', productName: 'Parafuso Sextavado M10', type: 'saida', quantity: 20, date: formatISO(new Date(2023, 10, 5)), reason: 'Produção Lote A' },
    { id: 'm3', productId: '2', productName: 'Arruela Lisa M10', type: 'entrada', quantity: 50, date: formatISO(new Date(2023, 10, 2)) },
    { id: 'm4', productId: '4', productName: 'Óleo Lubrificante XPTO', type: 'entrada', quantity: 10, date: formatISO(new Date(2023, 9, 15)) },
    { id: 'm5', productId: '4', productName: 'Óleo Lubrificante XPTO', type: 'saida', quantity: 5, date: formatISO(new Date(2023, 10, 20)), reason: 'Manutenção Preventiva' },
];


export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('products');
      const storedMovements = localStorage.getItem('movements');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts); // Load initial if nothing in local storage
      }
      if (storedMovements) {
        setMovements(JSON.parse(storedMovements));
      } else {
        setMovements(initialMovements); // Load initial if nothing in local storage
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('movements', JSON.stringify(movements));
    }
  }, [movements, isInitialized]);


  const addProduct = (productData: Omit<Product, 'id' | 'currentStock'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(), // simple unique ID
      currentStock: 0,
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  }

  const addStockEntry = (productId: string, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, currentStock: p.currentStock + quantity } : p
      )
    );
    const product = getProductById(productId);
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product?.name,
      type: 'entrada',
      quantity,
      date: formatISO(new Date()),
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const addStockWithdrawal = (productId: string, quantity: number, reason: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, currentStock: Math.max(0, p.currentStock - quantity) } : p
      )
    );
    const product = getProductById(productId);
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product?.name,
      type: 'saida',
      quantity,
      date: formatISO(new Date()),
      reason,
    };
    setMovements((prev) => [newMovement, ...prev]);
  };


  if (!isInitialized) {
    return null; // Or a loading indicator
  }
  
  return (
    <StockContext.Provider value={{ products, movements, addProduct, addStockEntry, addStockWithdrawal, getProductById }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
