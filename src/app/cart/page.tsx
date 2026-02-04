'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { CartItem } from '@/components/cart/CartItem';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { formatIDR } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { t } = useLanguage();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(items.map((_, index) => index.toString()))
  );

  const subtotal = getTotal();
  const shippingCost = 0; // Free shipping for now
  const grandTotal = subtotal + shippingCost;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(
        new Set(items.map((_, index) => index.toString()))
      );
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (index: number, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(index.toString());
    } else {
      newSelected.delete(index.toString());
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;

    if (confirm(t('cart.confirmDelete'))) {
      Array.from(selectedItems)
        .reverse()
        .forEach((indexStr) => {
          const index = parseInt(indexStr, 10);
          const item = items[index];
          removeItem(item.product.id, item.size, item.color);
        });
      setSelectedItems(new Set());
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('cart.continueShopping')}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('cart.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            Total {items.length} item(s)
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.size === items.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="font-medium text-gray-900">
                  {t('cart.selectAll')} ({selectedItems.size}/{items.length})
                </span>
              </label>

              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.size === 0}
                className="text-sm text-gray-600 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('cart.deleteSelected')}
              </button>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <CartItem
                key={`${item.product.id}-${item.size}-${item.color.code}`}
                item={item}
                selected={selectedItems.has(index.toString())}
                onSelect={(selected) => handleSelectItem(index, selected)}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(
                    item.product.id,
                    item.size,
                    item.color,
                    quantity
                  )
                }
                onRemove={() =>
                  removeItem(item.product.id, item.size, item.color)
                }
              />
            ))}
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="sticky top-4 bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                {t('cart.orderSummary')}
              </h2>

              <Separator />

              {/* Summary Rows */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span>
                    {shippingCost === 0 ? t('cart.free') : formatIDR(shippingCost)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {t('cart.total')}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatIDR(grandTotal)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={selectedItems.size === 0}
                >
                  {t('cart.checkout')} ({formatIDR(grandTotal)})
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/products">
                <Button variant="ghost" size="md" fullWidth>
                  {t('cart.continueShopping')}
                </Button>
              </Link>

              {/* Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="mb-2">💳 {t('cart.securePayment')}</p>
                <p className="mb-2">🚚 {t('cart.freeShipping')}</p>
                <p>📦 {t('cart.productionTime')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
