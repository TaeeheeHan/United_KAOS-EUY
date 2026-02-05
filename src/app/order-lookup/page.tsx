'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { Badge } from '@/components/common/Badge';
import { useOrderStore, Order } from '@/stores/order';
import { formatIDR } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type OrderStatus = 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Payment Pending', color: 'warning', icon: Clock },
  confirmed: { label: 'Payment Confirmed', color: 'info', icon: CheckCircle },
  production: { label: 'In Production', color: 'primary', icon: Package },
  shipped: { label: 'Shipped', color: 'success', icon: Truck },
  delivered: { label: 'Delivered', color: 'success', icon: CheckCircle },
};

export default function OrderLookupPage() {
  const { t } = useLanguage();
  const { getOrderByNumber, orderHistory } = useOrderStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null | 'not_found'>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order = getOrderByNumber(orderNumber);

    if (order && order.shippingInfo.email.toLowerCase() === email.toLowerCase()) {
      setSearchResult(order);
    } else {
      setSearchResult('not_found');
    }

    setIsSearching(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusStep = (status: OrderStatus) => {
    const steps: OrderStatus[] = ['pending', 'confirmed', 'production', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">
              Enter your order number and email to check the status of your order
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., KE-M1ABC-XYZ1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used for your order"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSearching}
                leftIcon={Search}
              >
                {isSearching ? 'Searching...' : 'Track Order'}
              </Button>
            </form>
          </div>

          {/* Search Result */}
          {searchResult === 'not_found' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600">
                We couldn&apos;t find an order with the provided information. Please check your order number and email address.
              </p>
            </motion.div>
          )}

          {searchResult && searchResult !== 'not_found' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm">Order Number</p>
                    <p className="text-xl font-bold">{searchResult.orderNumber}</p>
                  </div>
                  <Badge
                    variant={statusConfig[searchResult.status].color as any}
                    size="lg"
                  >
                    {statusConfig[searchResult.status].label}
                  </Badge>
                </div>
                <p className="text-white/80 text-sm">
                  Ordered on {formatDate(searchResult.createdAt)}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
                <div className="flex items-center justify-between">
                  {(['pending', 'confirmed', 'production', 'shipped', 'delivered'] as OrderStatus[]).map((status, index) => {
                    const isCompleted = getStatusStep(searchResult.status) >= index;
                    const isCurrent = searchResult.status === status;
                    const Icon = statusConfig[status].icon;

                    return (
                      <div key={status} className="flex flex-col items-center flex-1">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {index < 4 && (
                            <div
                              className={`absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 ${
                                getStatusStep(searchResult.status) > index
                                  ? 'bg-primary'
                                  : 'bg-gray-200'
                              }`}
                              style={{ width: 'calc(100% - 2.5rem)' }}
                            />
                          )}
                        </div>
                        <p className={`text-xs mt-2 text-center ${
                          isCompleted ? 'text-primary font-medium' : 'text-gray-400'
                        }`}>
                          {statusConfig[status].label.split(' ')[0]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {searchResult.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          {item.color} / {item.size} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatIDR(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{searchResult.shippingInfo.fullName}</p>
                  <p>{searchResult.shippingInfo.address}</p>
                  <p>
                    {searchResult.shippingInfo.city}, {searchResult.shippingInfo.province} {searchResult.shippingInfo.postalCode}
                  </p>
                  <p>{searchResult.shippingInfo.phone}</p>
                </div>
              </div>

              {/* Order Total */}
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatIDR(searchResult.total)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Need help with your order?</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Contact us via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
