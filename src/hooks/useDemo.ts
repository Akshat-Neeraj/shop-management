'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, Sale } from '@/types';

export function useDemoInventory(userId?: string) {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const loadInventory = () => {
      try {
        const stored = localStorage.getItem('demo-inventory');
        if (stored) {
          const inventory = JSON.parse(stored);
          setData(inventory);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [userId]);

  const addDocument = async (document: Omit<InventoryItem, 'id' | 'created_at'>) => {
    try {
      const newItem: InventoryItem = {
        ...document,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      const updatedInventory = [...data, newItem];
      setData(updatedInventory);
      localStorage.setItem('demo-inventory', JSON.stringify(updatedInventory));
      
      return newItem.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedInventory = data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setData(updatedInventory);
      localStorage.setItem('demo-inventory', JSON.stringify(updatedInventory));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const updatedInventory = data.filter(item => item.id !== id);
      setData(updatedInventory);
      localStorage.setItem('demo-inventory', JSON.stringify(updatedInventory));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addDocument, updateDocument, deleteDocument };
}

export function useDemoSales(userId?: string) {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const loadSales = () => {
      try {
        const stored = localStorage.getItem('demo-sales');
        if (stored) {
          const sales = JSON.parse(stored);
          setData(sales);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [userId]);

  const addDocument = async (document: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const newSale: Sale = {
        ...document,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      const updatedSales = [newSale, ...data];
      setData(updatedSales);
      localStorage.setItem('demo-sales', JSON.stringify(updatedSales));
      
      return newSale.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const updatedSales = data.filter(item => item.id !== id);
      setData(updatedSales);
      localStorage.setItem('demo-sales', JSON.stringify(updatedSales));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addDocument, deleteDocument };
}
