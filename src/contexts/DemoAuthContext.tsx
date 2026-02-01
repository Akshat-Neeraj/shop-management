'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface DemoItem {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  lowStockThreshold: number;
  lastSoldDate?: Date | null;
}

interface DemoSale {
  id: string;
  items: any[];
  total: number;
  profit: number;
  date: Date;
}

interface DemoContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-login demo user
    const demoUser = { id: 'demo-user', email: 'demo@guptatraders.com' };
    setUser(demoUser);
    
    // Initialize demo data if not exists
    if (!localStorage.getItem('demo-inventory')) {
      const demoInventory: DemoItem[] = [
        {
          id: '1',
          name: 'Rice Basmati 5kg',
          category: 'Grains',
          price: 250,
          costPrice: 200,
          stockLevel: 50,
          lowStockThreshold: 10,
          lastSoldDate: null
        },
        {
          id: '2',
          name: 'Cooking Oil 1L',
          category: 'Oils',
          price: 120,
          costPrice: 90,
          stockLevel: 30,
          lowStockThreshold: 5,
          lastSoldDate: null
        },
        {
          id: '3',
          name: 'Sugar 1kg',
          category: 'Sugar',
          price: 45,
          costPrice: 35,
          stockLevel: 100,
          lowStockThreshold: 20,
          lastSoldDate: null
        },
        {
          id: '4',
          name: 'Wheat Flour 2kg',
          category: 'Flour',
          price: 80,
          costPrice: 65,
          stockLevel: 25,
          lowStockThreshold: 8,
          lastSoldDate: null
        },
        {
          id: '5',
          name: 'Tea Powder 250g',
          category: 'Beverages',
          price: 95,
          costPrice: 75,
          stockLevel: 15,
          lowStockThreshold: 3,
          lastSoldDate: null
        }
      ];
      localStorage.setItem('demo-inventory', JSON.stringify(demoInventory));
    }
    
    if (!localStorage.getItem('demo-sales')) {
      localStorage.setItem('demo-sales', JSON.stringify([]));
    }
  }, []);

  const signIn = async () => {
    setLoading(true);
    const demoUser = { id: 'demo-user', email: 'demo@guptatraders.com' };
    setUser(demoUser);
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    const demoUser = { id: 'demo-user', email: 'demo@guptatraders.com' };
    setUser(demoUser);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const demoUser = { id: 'demo-user', email: 'demo@guptatraders.com' };
    setUser(demoUser);
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <DemoContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout 
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}
