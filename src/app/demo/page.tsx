'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useDemoInventory, useDemoSales } from '@/hooks/useDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Plus, 
  ShoppingCart,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DemoDashboard() {
  const { user } = useDemoAuth();
  const { data: inventory } = useDemoInventory(user?.id);
  const { data: sales } = useDemoSales(user?.id);
  
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);

  useEffect(() => {
    if (!sales || sales.length === 0) return;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const todaySales = sales.filter(sale => {
      const saleDate = sale.date instanceof Date ? sale.date : new Date(sale.date);
      return saleDate >= todayStart;
    });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const todayProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    const todayCount = todaySales.length;

    setTodayRevenue(todayRevenue);
    setTodayProfit(todayProfit);
    setTodaySales(todayCount);
  }, [sales]);

  useEffect(() => {
    if (!inventory) return;

    const totalStock = inventory.reduce((sum, item) => sum + (item.stockLevel || 0), 0);
    const lowStockItems = inventory.filter(item => 
      item.stockLevel <= item.lowStockThreshold
    ).length;

    setTotalStock(totalStock);
    setLowStockItems(lowStockItems);
  }, [inventory]);

  const [chartData, setChartData] = useState({
    labels: [] as string[],
    revenue: [] as number[],
    profit: [] as number[],
  });

  useEffect(() => {
    if (!sales || sales.length === 0) return;

    const labels = [];
    const revenueData = [];
    const profitData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const daySales = sales?.filter(sale => {
        const saleDate = sale.date instanceof Date ? sale.date : new Date(sale.date);
        return saleDate >= dayStart && saleDate < dayEnd;
      }) || [];

      const dayRevenue = daySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const dayProfit = daySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      revenueData.push(dayRevenue);
      profitData.push(dayProfit);
    }

    setChartData({ labels, revenue: revenueData, profit: profitData });
  }, [sales]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: chartData.revenue,
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
        borderWidth: 1,
      },
      {
        label: 'Profit',
        data: chartData.profit,
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your business overview.</p>
        </div>
        <Badge variant="secondary" className="bg-yellow-500 text-black">
          Demo Mode
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              {todaySales} sales today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Today's Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{todayProfit.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              From {todaySales} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStock}</div>
            <p className="text-xs text-gray-400">
              {inventory?.length || 0} different products
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Low Stock Alert</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{lowStockItems}</div>
            <p className="text-xs text-gray-400">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">7-Day Sales Performance</CardTitle>
            <CardDescription className="text-gray-400">Revenue and profit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar options={chartOptions} data={data} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/inventory/add">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </Link>
            
            <Link href="/pos">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Process Sale
              </Button>
            </Link>
            
            <Link href="/inventory">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                <Package className="h-4 w-4 mr-2" />
                View Inventory
              </Button>
            </Link>
            
            <Link href="/reports/sales">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Sales Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Sales</CardTitle>
          <CardDescription className="text-gray-400">Latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {sales && sales.length > 0 ? (
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {sale.items.length} items sold
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{sale.total.toFixed(2)}</p>
                    <p className="text-green-400 text-sm">₹{sale.profit.toFixed(2)} profit</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No sales yet. Start by processing your first sale!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
