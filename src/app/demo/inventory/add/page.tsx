'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useDemoInventory } from '@/hooks/useDemo';
import DemoProtectedRoute from '@/components/demo-protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Package } from 'lucide-react';
import Link from 'next/link';

export default function DemoAddItemPage() {
  const { user } = useDemoAuth();
  const { addDocument } = useDemoInventory(user?.id);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    costPrice: '',
    stockLevel: '',
    lowStockThreshold: '10'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    const costPrice = parseFloat(formData.costPrice);
    if (isNaN(costPrice) || costPrice < 0) {
      setError('Cost price must be a non-negative number');
      return false;
    }
    const stockLevel = parseInt(formData.stockLevel);
    if (isNaN(stockLevel) || stockLevel < 0) {
      setError('Stock level must be a non-negative number');
      return false;
    }
    const lowStockThreshold = parseInt(formData.lowStockThreshold);
    if (isNaN(lowStockThreshold) || lowStockThreshold < 0) {
      setError('Low stock threshold must be a non-negative number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await addDocument({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        stockLevel: parseInt(formData.stockLevel),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        lastSoldDate: null,
        userId: user!.id
      });
      
      router.push('/demo/inventory');
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DemoProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/demo/inventory">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="text-gray-400">Add a new product to your inventory</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-yellow-500 text-black">
            Demo Mode
          </Badge>
        </div>

        <Card className="bg-gray-800 border-gray-700 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Product Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details for the new product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Rice Basmati 5kg"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Grains"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="250.00"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice" className="text-gray-300">Cost Price (₹) *</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="200.00"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockLevel" className="text-gray-300">Initial Stock *</Label>
                  <Input
                    id="stockLevel"
                    name="stockLevel"
                    type="number"
                    value={formData.stockLevel}
                    onChange={handleChange}
                    placeholder="50"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold" className="text-gray-300">Low Stock Alert *</Label>
                  <Input
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    placeholder="10"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Alert when stock reaches this level
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/demo/inventory">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DemoProtectedRoute>
  );
}
