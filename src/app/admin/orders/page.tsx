'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Separator } from '@/components/common/Separator';
import { useOrderStore, Order } from '@/stores/order';
import { formatIDR } from '@/lib/utils';

type OrderStatus = 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered';

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'KE-ABC123-XYZ',
    items: [
      { productId: '1', productName: 'Kaos Bandung Pride', productImage: '', size: 'L', color: 'Black', quantity: 2, price: 150000 },
    ],
    shippingInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890',
      address: 'Jl. Example No. 123',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40123',
    },
    paymentMethod: 'bank_transfer',
    subtotal: 300000,
    shippingCost: 0,
    total: 300000,
    status: 'production',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: 'KE-DEF456-ABC',
    items: [
      { productId: '2', productName: 'Premium Hoodie EUY', productImage: '', size: 'XL', color: 'Navy', quantity: 1, price: 350000 },
    ],
    shippingInfo: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '081234567891',
      address: 'Jl. Sample No. 456',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '10110',
    },
    paymentMethod: 'ewallet',
    subtotal: 350000,
    shippingCost: 0,
    total: 350000,
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function AdminOrdersPage() {
  const { orderHistory } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Combine mock data with real orders for demo
  const allOrders = [...mockOrders, ...orderHistory];

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track all customer orders</p>
        </div>
        <Button variant="outline" leftIcon={Download}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="production">In Production</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-primary font-medium">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.shippingInfo.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{order.shippingInfo.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatIDR(order.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary hover:text-primary/80 p-2"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 font-mono">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                <Separator />

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedOrder.shippingInfo.fullName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedOrder.shippingInfo.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedOrder.shippingInfo.phone}</p>
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingInfo.address}<br />
                    {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.province}<br />
                    {selectedOrder.shippingInfo.postalCode}
                  </p>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            {item.color} / {item.size} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatIDR(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Total */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatIDR(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Shipping</span>
                    <span>{selectedOrder.shippingCost === 0 ? 'Free' : formatIDR(selectedOrder.shippingCost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatIDR(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth>
                    Update Status
                  </Button>
                  <Button variant="primary" fullWidth leftIcon={Download}>
                    Download Invoice
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
