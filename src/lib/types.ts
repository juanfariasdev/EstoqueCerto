export interface Product {
  id: string;
  name: string;
  description: string;
  unit?: string; // Ex: un, kg, L, pç
  minStockLevel: number;
  currentStock: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string; // For display purposes
  type: 'entrada' | 'saida';
  quantity: number;
  date: string; // ISO string date
  reason?: string;
}
