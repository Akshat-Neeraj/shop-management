'use client';

import { useState, useEffect } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { InventoryItem, Sale } from '@/types';

export function useInventory(userId?: string) {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    // Set up real-time subscription
    const subscription = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as InventoryItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as InventoryItem : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const addDocument = async (document: Omit<InventoryItem, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addDocument, updateDocument, deleteDocument };
}

export function useSales(userId?: string) {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSales = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sales_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as Sale, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as Sale : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const addDocument = async (document: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addDocument, deleteDocument };
}
