'use client';

import { useState } from 'react';
import { DemoAuthProvider } from '@/contexts/DemoAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DemoLandingPage() {
  const [loading, setLoading] = useState(false);

  const handleStartDemo = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      window.location.href = '/demo';
    }, 1000);
  };

  return (
    <DemoAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <Store className="h-8 w-8 text-purple-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Gupta Traders</h1>
                  <p className="text-xs text-gray-400">Inventory Management</p>
                </div>
              </div>
              <Badge className="bg-yellow-500 text-black font-medium">
                Demo Mode
              </Badge>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Try Now - No Setup Required
            </Badge>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              Professional Inventory Management
              <span className="text-purple-400"> for Your Shop</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Manage products, process sales, and track business performance - all from your phone, tablet, or computer. 
              No installation, no setup, just click and start!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                onClick={handleStartDemo}
                disabled={loading}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Starting Demo...
                  </div>
                ) : (
                  <>
                    Try Live Demo Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
              
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-1" />
                  <span>No Registration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-1" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-1" />
                  <span>Full Features</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Everything You Need to Run Your Shop
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <Package className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="text-white">Inventory Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Add products, track stock levels, and get low stock alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Add unlimited products
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Real-time stock tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Low stock alerts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <ShoppingCart className="h-10 w-10 text-green-400 mb-2" />
                  <CardTitle className="text-white">Point of Sale</CardTitle>
                  <CardDescription className="text-gray-400">
                    Process sales quickly with our modern POS system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Fast checkout process
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Automatic stock updates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Mobile-friendly cart
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-blue-400 mb-2" />
                  <CardTitle className="text-white">Business Analytics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track sales, revenue, and profit with detailed reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Sales performance charts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Profit tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Top products report
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Shop Owners Love This System
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Smartphone className="h-8 w-8 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Works on Any Device
                  </h3>
                  <p className="text-gray-300">
                    Use your phone, tablet, or computer. Access your inventory from anywhere, anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Zap className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Real-Time Updates
                  </h3>
                  <p className="text-gray-300">
                    Changes sync instantly across all devices. Add product on computer, see it on phone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Secure & Reliable
                  </h3>
                  <p className="text-gray-300">
                    Your data is safe and secure. Never lose inventory information with automatic backups.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Star className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Easy to Use
                  </h3>
                  <p className="text-gray-300">
                    No technical knowledge needed. Simple interface designed for shop owners like you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-purple-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of shop owners who've modernized their inventory management.
            </p>
            
            <Button 
              onClick={handleStartDemo}
              disabled={loading}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
                  Loading Demo...
                </div>
              ) : (
                <>
                  Try Demo Now - It's Free!
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-purple-200 mt-4">
              No registration required • Full access to all features • Works immediately
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-black/40 py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Store className="h-6 w-6 text-purple-400" />
              <span className="text-white font-semibold">Gupta Traders</span>
            </div>
            <p className="text-gray-400">
              Professional Inventory Management for Modern Shops
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2024 Gupta Traders. Built with ❤️ for shop owners.
            </p>
          </div>
        </footer>
      </div>
    </DemoAuthProvider>
  );
}
