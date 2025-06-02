export interface Product {
  id: string;
  name: string;
  description: string;
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
