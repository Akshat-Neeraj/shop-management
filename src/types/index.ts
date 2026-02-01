export interface InventoryItem {
  id?: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  lowStockThreshold: number;
  lastSoldDate?: Date | null;
  userId: string;
}

export interface Sale {
  id?: string;
  items: SaleItem[];
  total: number;
  profit: number;
  date: Date;
  userId: string;
}

export interface SaleItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface CartItem extends SaleItem {
  name: string;
  stockLevel: number;
}
