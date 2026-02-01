'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useInventory, useSales } from '@/hooks/useSupabase';
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
  ArrowDownRight
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: inventory } = useInventory(user?.id);
  const { data: sales } = useSales(user?.id);
  const [todayStats, setTodayStats] = useState({
    revenue: 0,
    profit: 0,
    sales: 0
  });
  const [weekStats, setWeekStats] = useState({
    revenue: 0,
    profit: 0,
    sales: 0
  });

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

    const weekSales = sales.filter(sale => {
      const saleDate = sale.date instanceof Date ? sale.date : new Date(sale.date);
      return saleDate >= weekStart;
    });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const todayProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    const todayCount = todaySales.length;

    const weekRevenue = weekSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const weekProfit = weekSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    const weekCount = weekSales.length;

    setTodayStats({
      revenue: todayRevenue,
      profit: todayProfit,
      sales: todayCount
    });

    setWeekStats({
      revenue: weekRevenue,
      profit: weekProfit,
      sales: weekCount
    });
  }, [sales]);

  const totalStock = inventory?.reduce((sum, item) => sum + (item.stockLevel || 0), 0) || 0;
  const lowStockItems = inventory?.filter(item => 
    item.stockLevel <= item.lowStockThreshold
  ).length || 0;

  // Prepare chart data for last 7 days
  const chartData = () => {
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

    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          backgroundColor: 'hsl(250, 80%, 60%)',
          borderColor: 'hsl(250, 80%, 60%)',
          borderWidth: 1,
        },
        {
          label: 'Profit',
          data: profitData,
          backgroundColor: 'hsl(142, 76%, 36%)',
          borderColor: 'hsl(142, 76%, 36%)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(220, 10%, 85%)',
        },
      },
      title: {
        display: true,
        text: 'Sales Overview (Last 7 Days)',
        color: 'hsl(220, 10%, 85%)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(220, 8%, 60%)',
        },
        grid: {
          color: 'hsl(256, 25%, 25%)',
        },
      },
      y: {
        ticks: {
          color: 'hsl(220, 8%, 60%)',
        },
        grid: {
          color: 'hsl(256, 25%, 25%)',
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/inventory/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
          <Link href="/pos">
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayStats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {weekStats.sales > 0 ? (
                <span className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  From {weekStats.sales} sales this week
                </span>
              ) : (
                'No sales this week'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayStats.profit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.sales > 0 ? (
                <span className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  From {todayStats.sales} sales today
                </span>
              ) : (
                'No sales today'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockItems > 0 ? (
                <Badge variant="warning" className="text-xs">
                  {lowStockItems} items low in stock
                </Badge>
              ) : (
                'All items well stocked'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>
            Revenue and profit trends over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={chartData()} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/inventory/add">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Add New Item
              </Button>
            </Link>
            <Link href="/pos">
              <Button variant="outline" className="w-full h-20 flex-col">
                <ShoppingCart className="h-6 w-6 mb-2" />
                New Sale
              </Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                View Inventory
              </Button>
            </Link>
            <Link href="/reports/sales">
              <Button variant="outline" className="w-full h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
