'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatIDR } from '@/lib/utils';

const statsCards = [
  {
    title: 'Total Orders',
    value: '156',
    change: '+12%',
    changeType: 'positive' as const,
    icon: ShoppingBag,
    color: 'bg-blue-500',
  },
  {
    title: 'Revenue',
    value: formatIDR(45600000),
    change: '+8%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Products',
    value: '24',
    change: '+2',
    changeType: 'positive' as const,
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    title: 'Customers',
    value: '89',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'bg-orange-500',
  },
];

const orderStatusCards = [
  { status: 'Pending Payment', count: 5, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
  { status: 'In Production', count: 12, icon: Package, color: 'text-blue-500 bg-blue-50' },
  { status: 'Ready to Ship', count: 8, icon: Truck, color: 'text-purple-500 bg-purple-50' },
  { status: 'Completed', count: 131, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
];

export default function AdminDashboardPage() {
  // TODO: fetch recent orders from API when ready
  const recentOrders: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Status Overview</h2>
          <Link
            href="/admin/orders"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All Orders →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStatusCards.map((item) => (
            <div
              key={item.status}
              className={`${item.color} rounded-xl p-4`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm opacity-80">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>

        {recentOrders.length > 0 ? (
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-primary">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.shippingInfo.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingInfo.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'production'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'shipped'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatIDR(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Orders will appear here when customers place them
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
