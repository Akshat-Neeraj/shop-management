'use client';

import { useEffect, useState } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useDemoInventory, useDemoSales } from '@/hooks/useDemo';
import DemoProtectedRoute from '@/components/demo-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package,
  Calendar,
  Trash2,
  Download
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

export default function DemoReportsPage() {
  const { user } = useDemoAuth();
  const { data: inventory } = useDemoInventory(user?.id);
  const { data: sales, deleteDocument } = useDemoSales(user?.id);
  
  const [timeRange, setTimeRange] = useState('all');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [filteredSales, setFilteredSales] = useState(sales || []);

  useEffect(() => {
    if (!sales || sales.length === 0) return;

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = sales.filter(sale => {
      const saleDate = sale.date instanceof Date ? sale.date : new Date(sale.date);
      return saleDate >= startDate;
    });

    setFilteredSales(filtered);
  }, [sales, timeRange]);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const totalSales = filteredSales.length;

  // Top products by revenue
  const topProductsByRevenue = inventory?.map(item => {
    const productSales = filteredSales.filter(sale => 
      sale.items.some((saleItem: any) => saleItem.itemId === item.id)
    );
    
    const revenue = productSales.reduce((sum, sale) => {
      const saleItem = sale.items.find((item: any) => item.itemId === item.id);
      return sum + (saleItem ? saleItem.price * saleItem.quantity : 0);
    }, 0);

    return {
      name: item.name,
      revenue,
      unitsSold: productSales.reduce((sum, sale) => {
        const saleItem = sale.items.find((item: any) => item.itemId === item.id);
        return sum + (saleItem ? saleItem.quantity : 0);
      }, 0)
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5) || [];

  // Chart data
  const chartData = {
    labels: topProductsByRevenue.map(p => p.name),
    datasets: [
      {
        label: 'Revenue',
        data: topProductsByRevenue.map(p => p.revenue),
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
        borderWidth: 1,
      },
    ],
  };

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

  const clearAllSales = async () => {
    try {
      // Delete all sales
      for (const sale of filteredSales) {
        sale.id && await deleteDocument(sale.id);
      }
      setClearDialogOpen(false);
    } catch (error) {
      console.error('Failed to clear sales:', error);
    }
  };

  return (
    <DemoProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Reports</h1>
            <p className="text-gray-400">Analyze your business performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              Demo Mode
            </Badge>
            <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Sales Data
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Clear Sales Data</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Are you sure you want to clear all sales data? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setClearDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={clearAllSales}
                  >
                    Clear All Sales
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Time Range Selector */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Time Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'today', label: 'Today' },
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: 'all', label: 'All Time' }
              ].map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "outline"}
                  onClick={() => setTimeRange(range.value)}
                  className={
                    timeRange === range.value 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {range.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-400">
                From {totalSales} sales
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{totalProfit.toFixed(2)}</div>
              <p className="text-xs text-gray-400">
                {totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin` : '0% margin'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalSales}</div>
              <p className="text-xs text-gray-400">
                Transactions in selected period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top 5 Products by Revenue</CardTitle>
              <CardDescription className="text-gray-400">Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar options={chartOptions} data={chartData} />
              </div>
            </CardContent>
          </Card>

          {/* Top Products Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top 5 Products by Units Sold</CardTitle>
              <CardDescription className="text-gray-400">Most sold items</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Product</TableHead>
                    <TableHead className="text-gray-300">Units Sold</TableHead>
                    <TableHead className="text-gray-300">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProductsByRevenue.map((product, index) => (
                    <TableRow key={index} className="border-gray-700">
                      <TableCell className="text-white">{product.name}</TableCell>
                      <TableCell className="text-white">{product.unitsSold}</TableCell>
                      <TableCell className="text-white">₹{product.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Sales</CardTitle>
            <CardDescription className="text-gray-400">Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSales.length > 0 ? (
              <div className="space-y-3">
                {filteredSales.slice(0, 10).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {sale.items.length} items sold
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(sale.date).toLocaleDateString()} at {new Date(sale.date).toLocaleTimeString()}
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
              <p className="text-gray-400 text-center py-8">No sales in the selected period</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DemoProtectedRoute>
  );
}
