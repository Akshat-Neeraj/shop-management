'use client';

import { useState, useEffect } from 'react';

interface Sale {
  id: string;
  items: any[];
  total: number;
  profit: number;
  date: Date;
}

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  lowStockThreshold: number;
}

export default function SalesReportPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const salesData = JSON.parse(localStorage.getItem('demo-sales') || '[]');
    const inventoryData = JSON.parse(localStorage.getItem('demo-inventory') || '[]');
    setSales(salesData);
    setItems(inventoryData);
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalSales = sales.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sales Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{totalSales} sales</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
            <p className="text-3xl font-bold text-green-600">₹{totalProfit.toLocaleString()}</p>
            <p className="text-sm text-gray-600">
              {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% margin
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-purple-600">{items.length}</p>
            <p className="text-sm text-gray-600">In inventory</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">
              {items.filter(item => item.stockLevel <= item.lowStockThreshold).length}
            </p>
            <p className="text-sm text-gray-600">Need restock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Sales</h2>
            </div>
            <div className="p-6">
              {sales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sales yet</p>
              ) : (
                <div className="space-y-4">
                  {sales.slice(-5).reverse().map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sale #{sale.id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(sale.date).toLocaleDateString()} • {sale.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{sale.total}</p>
                        <p className="text-sm text-green-600">₹{sale.profit} profit</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Low Stock Alert</h2>
            </div>
            <div className="p-6">
              {items.filter(item => item.stockLevel <= item.lowStockThreshold).length === 0 ? (
                <p className="text-gray-500 text-center py-8">All items are well stocked</p>
              ) : (
                <div className="space-y-3">
                  {items.filter(item => item.stockLevel <= item.lowStockThreshold).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {item.stockLevel} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
