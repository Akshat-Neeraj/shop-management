'use client';

import { useState } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useDemoInventory, useDemoSales } from '@/hooks/useDemo';
import DemoProtectedRoute from '@/components/demo-protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Package,
  Search
} from 'lucide-react';
import { CartItem, InventoryItem } from '@/types';

export default function DemoPOSPage() {
  const { user } = useDemoAuth();
  const { data: inventory } = useDemoInventory(user?.id);
  const { addDocument: addSale } = useDemoSales(user?.id);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.stockLevel > 0
  ) || [];

  const addToCart = (item: InventoryItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.itemId === item.id);
      if (existingItem) {
        if (existingItem.quantity < item.stockLevel) {
          return prevCart.map(cartItem =>
            cartItem.itemId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          return prevCart;
        }
      } else {
        return [...prevCart, {
          itemId: item.id!,
          name: item.name,
          price: item.price,
          quantity: 1,
          stockLevel: item.stockLevel
        }];
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.itemId === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            return null;
          }
          if (newQuantity <= item.stockLevel) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.itemId !== itemId));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getProfit = () => {
    return cart.reduce((total, cartItem) => {
      const inventoryItem = inventory?.find(item => item.id === cartItem.itemId);
      if (inventoryItem) {
        return total + ((cartItem.price - inventoryItem.costPrice) * cartItem.quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setProcessing(true);

    try {
      // Create the sale record
      const saleData = {
        items: cart.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotal(),
        profit: getProfit(),
        date: new Date(),
        userId: user!.id
      };

      await addSale(saleData);

      // Update inventory stock levels
      cart.forEach(cartItem => {
        const inventoryItem = inventory?.find(item => item.id === cartItem.itemId);
        if (inventoryItem) {
          // In demo mode, we'll update localStorage directly
          const currentInventory = JSON.parse(localStorage.getItem('demo-inventory') || '[]');
          const updatedInventory = currentInventory.map((item: InventoryItem) => {
            if (item.id === cartItem.itemId) {
              return {
                ...item,
                stockLevel: item.stockLevel - cartItem.quantity,
                lastSoldDate: new Date()
              };
            }
            return item;
          });
          localStorage.setItem('demo-inventory', JSON.stringify(updatedInventory));
        }
      });

      // Clear cart
      setCart([]);
      setCartOpen(false);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DemoProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Point of Sale</h1>
            <p className="text-gray-400">Process sales and manage transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              Demo Mode
            </Badge>
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger onClick={() => setCartOpen(true)}>
                <Button className="bg-green-600 hover:bg-green-700 text-white relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-800 border-gray-700">
                <SheetHeader>
                  <SheetTitle className="text-white">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.itemId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-gray-400">₹{item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.itemId, -1)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.itemId, 1)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.itemId)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between text-white mb-2">
                          <span>Total:</span>
                          <span className="font-bold">₹{getTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-400 mb-4">
                          <span>Profit:</span>
                          <span className="font-bold">₹{getProfit().toFixed(2)}</span>
                        </div>
                        <Button
                          onClick={handleCheckout}
                          disabled={processing || cart.length === 0}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Checkout
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                  <Badge variant={item.stockLevel <= item.lowStockThreshold ? "destructive" : "success"}>
                    {item.stockLevel} in stock
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-bold text-lg">₹{item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Profit:</span>
                    <span className="text-green-400">₹{(item.price - item.costPrice).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => addToCart(item)}
                    disabled={item.stockLevel === 0}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'No products found matching your search.' : 'No products available in inventory.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DemoProtectedRoute>
  );
}
