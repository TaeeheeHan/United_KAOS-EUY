'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, User } from 'lucide-react';
import { CartItem } from '@/components/cart/CartItem';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { t } = useLanguage();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [bulkThreshold, setBulkThreshold] = useState(10);

  useEffect(() => {
    fetch('/api/settings?key=bulk_order_threshold')
      .then((r) => r.json())
      .then((data) => {
        if (data.value !== undefined) setBulkThreshold(Number(data.value));
      })
      .catch(() => {});
  }, []);

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const isBulk = totalQty >= bulkThreshold;

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.price + item.custom_fee_per_unit) * item.quantity,
    0
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

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
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            ← {t('cart.continueShopping')}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('cart.title')}
          </h1>
          <p className="text-gray-600 mt-2">{totalQty} item(s)</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.id, quantity)
                }
                onRemove={() =>
                  removeItem(item.id)
                }
              />
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 h-fit">
            {/* Order type badge */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('cart.orderSummary')}</h2>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isBulk
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isBulk ? (
                  <Package className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                {isBulk ? t('customOrder.bulk.title') : t('customOrder.personal.title')}
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>{shippingCost === 0 ? t('cart.free') : formatIDR(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t('products.quantity')}</span>
                <span>{totalQty} pcs</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">{t('cart.total')}</span>
              <span className="text-2xl font-bold text-primary">
                {formatIDR(total)}
              </span>
            </div>

            {isBulk && (
              <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                {t('customOrder.bulk.feature2')}
              </p>
            )}

            <Link href="/checkout">
              <Button fullWidth size="lg">
                {t('cart.checkout')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
