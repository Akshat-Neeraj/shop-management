'use client';

import { useState } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useDemoInventory } from '@/hooks/useDemo';
import DemoProtectedRoute from '@/components/demo-protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Search,
  Filter
} from 'lucide-react';
import { InventoryItem } from '@/types';
import Link from 'next/link';

export default function DemoInventoryPage() {
  const { user } = useDemoAuth();
  const { data: inventory, loading, error, updateDocument, deleteDocument } = useDemoInventory(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockLevel === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (item.stockLevel <= item.lowStockThreshold) {
      return { label: 'Low Stock', variant: 'warning' as const };
    } else {
      return { label: 'In Stock', variant: 'success' as const };
    }
  };

  const handleStockEdit = (itemId: string, currentValue: number) => {
    setEditingItem(itemId);
    setEditValue(currentValue.toString());
  };

  const handleStockSave = async (itemId: string) => {
    const newStock = parseInt(editValue);
    if (!isNaN(newStock) && newStock >= 0) {
      await updateDocument(itemId, { stockLevel: newStock });
    }
    setEditingItem(null);
    setEditValue('');
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await deleteDocument(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading inventory: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <DemoProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
            <p className="text-gray-400">Manage your products and stock levels</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              Demo Mode
            </Badge>
            <Link href="/inventory/add">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Products ({filteredInventory.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Click on stock numbers to edit them inline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'No products found matching your search.' : 'No products in inventory yet.'}
                </p>
                <Link href="/inventory/add">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Product Name</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Cost</TableHead>
                      <TableHead className="text-gray-300">Stock</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{item.name}</TableCell>
                        <TableCell className="text-gray-300">{item.category}</TableCell>
                        <TableCell className="text-white">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">₹{item.costPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {editingItem === item.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-20 bg-gray-700 border-gray-600 text-white"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    item.id && handleStockSave(item.id);
                                  }
                                }}
                                onBlur={() => item.id && handleStockSave(item.id)}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:text-purple-400 transition-colors"
                              onClick={() => item.id && handleStockEdit(item.id, item.stockLevel)}
                            >
                              <span className="text-white font-medium">{item.stockLevel}</span>
                              <Edit className="inline h-3 w-3 ml-1 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStockStatus(item).variant}>
                            {getStockStatus(item).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/inventory/edit/${item.id}`}>
                              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              onClick={() => {
                                item.id && setItemToDelete(item.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Product</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DemoProtectedRoute>
  );
}
