'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useInventory, useSales } from '@/hooks/useSupabase';
import ProtectedRoute from '@/components/protected-route';
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

export const dynamic = 'force-dynamic';

export default function POSPage() {
  const { user } = useAuth();
  const { data: inventory, updateDocument } = useInventory(user?.id);
  const { addDocument: addSale } = useSales(user?.id);
  
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
        date: new Date().toISOString(),
        userId: user!.id
      };

      await addSale(saleData);

      // Update inventory stock levels
      for (const cartItem of cart) {
        const inventoryItem = inventory?.find(item => item.id === cartItem.itemId);
        if (inventoryItem) {
          await updateDocument(cartItem.itemId, {
            stockLevel: inventoryItem.stockLevel - cartItem.quantity,
            lastSoldDate: new Date().toISOString()
          });
        }
      }

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
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
            <p className="text-muted-foreground">Process sales and manage transactions</p>
          </div>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger onClick={() => setCartOpen(true)}>
              <Button size="lg" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.itemId, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.itemId, 1)}
                            disabled={item.quantity >= item.stockLevel}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeFromCart(item.itemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{getTotal().toFixed(2)}</span>
                      </div>
                      <Button 
                        onClick={handleCheckout} 
                        className="w-full" 
                        disabled={processing || cart.length === 0}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {processing ? 'Processing...' : 'Checkout'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item) => {
            const cartItem = cart.find(c => c.itemId === item.id);
            const quantityInCart = cartItem?.quantity || 0;
            const availableStock = item.stockLevel - quantityInCart;

            return (
              <Card key={item.id} className={`${availableStock === 0 ? 'opacity-50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant={availableStock === 0 ? 'destructive' : 'default'}>
                      {availableStock} left
                    </Badge>
                  </div>
                  <CardDescription>{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">₹{item.price.toFixed(2)}</span>
                      {quantityInCart > 0 && (
                        <Badge variant="secondary">In cart: {quantityInCart}</Badge>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(item)}
                      disabled={availableStock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredInventory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No products found matching your search.' : 'No products available in inventory.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
