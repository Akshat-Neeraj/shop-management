'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useInventory } from '@/hooks/useSupabase';
import ProtectedRoute from '@/components/protected-route';
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

export const dynamic = 'force-dynamic';

export default function InventoryPage() {
  const { user } = useAuth();
  const { data: inventory, loading, error, updateDocument, deleteDocument } = useInventory(user?.id);
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
    const newValue = parseInt(editValue);
    if (!isNaN(newValue) && newValue >= 0) {
      try {
        await updateDocument(itemId, { stockLevel: newValue });
      } catch (error) {
        console.error('Failed to update stock:', error);
      }
    }
    setEditingItem(null);
    setEditValue('');
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDocument(itemToDelete);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="text-destructive">Error loading inventory: {error}</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">Manage your products and stock levels</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredInventory.length})</CardTitle>
            <CardDescription>
              Click on stock numbers to edit them inline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>₹{item.costPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {editingItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 h-8"
                              autoFocus
                              onBlur={() => handleStockSave(item.id!)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleStockSave(item.id!);
                                } else if (e.key === 'Escape') {
                                  setEditingItem(null);
                                  setEditValue('');
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStockEdit(item.id!, item.stockLevel)}
                            className="hover:bg-muted px-2 py-1 rounded text-left w-20"
                          >
                            {item.stockLevel}
                          </button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setItemToDelete(item.id!);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredInventory.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No products found matching your search.' : 'No products in inventory yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
