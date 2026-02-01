'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInventory, useSales } from '@/hooks/useFirestore';
import ProtectedRoute from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Trash2,
  BarChart3,
  Calendar,
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

type TimeRange = 'today' | '7days' | '30days' | 'all';

export default function SalesReportPage() {
  const { user } = useAuth();
  const { data: inventory } = useInventory(user?.uid);
  const { data: sales, deleteDocument } = useSales(user?.uid);
  
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [filteredSales, setFilteredSales] = useState(sales || []);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalSales: 0
  });

  useEffect(() => {
    if (!sales || sales.length === 0) {
      setFilteredSales([]);
      setStats({ totalRevenue: 0, totalProfit: 0, totalSales: 0 });
      return;
    }

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'all':
      default:
        startDate = new Date(0);
        break;
    }

    const filtered = sales.filter(sale => {
      const saleDate = sale.date?.toDate ? sale.date.toDate() : new Date(sale.date);
      return saleDate >= startDate;
    });

    setFilteredSales(filtered);

    const totalRevenue = filtered.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalProfit = filtered.reduce((sum, sale) => sum + (sale.profit || 0), 0);

    setStats({
      totalRevenue,
      totalProfit,
      totalSales: filtered.length
    });
  }, [sales, timeRange]);

  const getTopProductsByRevenue = () => {
    const productRevenue: { [key: string]: { name: string; revenue: number; units: number } } = {};

    filteredSales.forEach(sale => {
      sale.items?.forEach((item: any) => {
        const inventoryItem = inventory?.find(inv => inv.id === item.itemId);
        if (inventoryItem) {
          if (!productRevenue[item.itemId]) {
            productRevenue[item.itemId] = {
              name: inventoryItem.name,
              revenue: 0,
              units: 0
            };
          }
          productRevenue[item.itemId].revenue += item.price * item.quantity;
          productRevenue[item.itemId].units += item.quantity;
        }
      });
    });

    return Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getTopProductsByUnits = () => {
    const productUnits: { [key: string]: { name: string; units: number; revenue: number } } = {};

    filteredSales.forEach(sale => {
      sale.items?.forEach((item: any) => {
        const inventoryItem = inventory?.find(inv => inv.id === item.itemId);
        if (inventoryItem) {
          if (!productUnits[item.itemId]) {
            productUnits[item.itemId] = {
              name: inventoryItem.name,
              units: 0,
              revenue: 0
            };
          }
          productUnits[item.itemId].units += item.quantity;
          productUnits[item.itemId].revenue += item.price * item.quantity;
        }
      });
    });

    return Object.values(productUnits)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  };

  const handleClearSalesData = async () => {
    try {
      for (const sale of filteredSales) {
        await deleteDocument(sale.id!);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to clear sales data:', error);
    }
  };

  const chartData = () => {
    const dailyData: { [key: string]: { revenue: number; profit: number } } = {};

    filteredSales.forEach(sale => {
      const saleDate = sale.date?.toDate ? sale.date.toDate() : new Date(sale.date);
      const dateKey = saleDate.toLocaleDateString();

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { revenue: 0, profit: 0 };
      }

      dailyData[dateKey].revenue += sale.total || 0;
      dailyData[dateKey].profit += sale.profit || 0;
    });

    const sortedDates = Object.keys(dailyData).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Revenue',
          data: sortedDates.map(date => dailyData[date].revenue),
          backgroundColor: 'hsl(250, 80%, 60%)',
          borderColor: 'hsl(250, 80%, 60%)',
          borderWidth: 1,
        },
        {
          label: 'Profit',
          data: sortedDates.map(date => dailyData[date].profit),
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
        text: `Sales Performance (${timeRange === 'today' ? 'Today' : timeRange === '7days' ? 'Last 7 Days' : timeRange === '30days' ? 'Last 30 Days' : 'All Time'})`,
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

  const topRevenueProducts = getTopProductsByRevenue();
  const topUnitsProducts = getTopProductsByUnits();

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
            <p className="text-muted-foreground">Track your business performance and insights</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Sales Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Sales Data</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all sales data for the selected time period? 
                    This action cannot be undone and will permanently delete {filteredSales.length} sales records.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleClearSalesData}>
                    Clear Data
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalSales} sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRevenue > 0 ? 
                  `${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}% margin` : 
                  'No revenue'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">
                Transactions processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              Revenue and profit trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={chartData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Top Products Tables */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Revenue</CardTitle>
              <CardDescription>
                Highest revenue generating products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRevenueProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">₹{product.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.units}</TableCell>
                    </TableRow>
                  ))}
                  {topRevenueProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Units Sold</CardTitle>
              <CardDescription>
                Most frequently sold products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUnitsProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.units}</TableCell>
                      <TableCell className="text-right">₹{product.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {topUnitsProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
