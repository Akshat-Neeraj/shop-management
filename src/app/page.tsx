'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  lowStockThreshold: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Initialize demo data if not exists
    if (!localStorage.getItem('demo-inventory')) {
      const demoInventory: Item[] = [
        {
          id: '1',
          name: 'Rice Basmati 5kg',
          category: 'Grains',
          price: 250,
          costPrice: 200,
          stockLevel: 50,
          lowStockThreshold: 10
        },
        {
          id: '2',
          name: 'Cooking Oil 1L',
          category: 'Oils',
          price: 120,
          costPrice: 90,
          stockLevel: 30,
          lowStockThreshold: 5
        },
        {
          id: '3',
          name: 'Sugar 1kg',
          category: 'Sugar',
          price: 45,
          costPrice: 35,
          stockLevel: 100,
          lowStockThreshold: 20
        },
        {
          id: '4',
          name: 'Wheat Flour 2kg',
          category: 'Flour',
          price: 80,
          costPrice: 65,
          stockLevel: 25,
          lowStockThreshold: 8
        },
        {
          id: '5',
          name: 'Tea Powder 250g',
          category: 'Beverages',
          price: 95,
          costPrice: 75,
          stockLevel: 15,
          lowStockThreshold: 3
        }
      ];
      localStorage.setItem('demo-inventory', JSON.stringify(demoInventory));
    }
    
    if (!localStorage.getItem('demo-sales')) {
      localStorage.setItem('demo-sales', JSON.stringify([]));
    }

    const inventory = JSON.parse(localStorage.getItem('demo-inventory') || '[]');
    setItems(inventory);
  }, []);

  const totalProducts = items.length;
  const lowStockItems = items.filter(item => item.stockLevel <= item.lowStockThreshold).length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stockLevel), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Gupta Traders</h1>
          <p className="text-xl mb-8">Professional Inventory Management System</p>
          <div className="flex justify-center space-x-4">
            <Link href="/inventory" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Manage Inventory
            </Link>
            <Link href="/pos" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              New Sale
            </Link>
            <Link href="/reports/sales" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              View Reports
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20">
            <h3 className="text-xl font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{totalProducts}</p>
            <p className="text-sm opacity-80">In inventory</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20">
            <h3 className="text-xl font-semibold mb-2">Low Stock Alert</h3>
            <p className="text-3xl font-bold text-yellow-400">{lowStockItems}</p>
            <p className="text-sm opacity-80">Need restock</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20">
            <h3 className="text-xl font-semibold mb-2">Total Value</h3>
            <p className="text-3xl font-bold">₹{totalValue.toLocaleString()}</p>
            <p className="text-sm opacity-80">Inventory value</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/inventory" className="bg-white/10 backdrop-blur p-8 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
              <p className="text-sm opacity-80">Track products, stock levels, and manage your inventory efficiently</p>
            </div>
          </Link>
          
          <Link href="/pos" className="bg-white/10 backdrop-blur p-8 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Point of Sale</h3>
              <p className="text-sm opacity-80">Process sales quickly with our modern POS interface</p>
            </div>
          </Link>
          
          <Link href="/reports/sales" className="bg-white/10 backdrop-blur p-8 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Sales Analytics</h3>
              <p className="text-sm opacity-80">View sales reports, revenue tracking, and business insights</p>
            </div>
          </Link>
        </div>

        {/* Sample Products Preview */}
        <div className="mt-12 bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Sample Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs opacity-80">{item.category}</p>
                <p className="text-lg font-bold">₹{item.price}</p>
                <p className="text-xs">Stock: {item.stockLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
