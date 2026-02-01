'use client';

import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  lowStockThreshold: number;
}

export default function POSPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('demo-inventory') || '[]');
    setItems(inventory);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Products</h2>
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.category}</p>
                      <p className="text-lg font-bold text-green-600">₹{item.price}</p>
                    </div>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={item.stockLevel === 0}
                    >
                      {item.stockLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹0</span>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700">
                  Process Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
