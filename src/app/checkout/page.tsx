'use client';

import Link from 'next/link';
import { CreditCard, Store, Smartphone, Banknote } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { useCartStore } from '@/stores/cart';
import { useCreateGuestOrder } from '@/lib/hooks/useGuestOrders';
import { formatIDR } from '@/lib/utils';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useCreateGuestOrder();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('SP');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    { code: 'SP', name: 'ShopeePay', icon: Smartphone },
    { code: 'I1', name: 'Indomaret', icon: Store },
    { code: 'FT', name: 'Retail', icon: Banknote },
  ];

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + (item.product.price + item.custom_fee_per_unit) * item.quantity,
      0
    );
  }, [items]);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <EmptyCart />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create guest order in database
      const { orderId, lookupToken } = await createOrder.mutateAsync({
        items,
        customer: { email, name, phone },
        shipping: { full_address: address, notes },
      });

      // Step 2: Create Duitku payment
      const paymentRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: total,
          email,
          phone,
          paymentMethod,
          productDetails: `Kaos EUY! - ${items.length} item(s)`,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.paymentUrl) {
        throw new Error(paymentData.error || 'Failed to create payment');
      }

      // Step 3: Save lookup info to sessionStorage for thank-you page
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({ orderId, lookupToken, email })
      );

      // Step 4: Clear cart and redirect to Duitku payment page
      clearCart();
      window.location.href = paymentData.paymentUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name (optional)
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone (optional)
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+62 ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Full address"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    type="text"
                    placeholder="Delivery instructions"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color.code}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.color.name} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatIDR(
                        (item.product.price + item.custom_fee_per_unit) *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 h-fit">
            <h2 className="text-xl font-bold text-gray-900">Summary</h2>

            <Separator />

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : formatIDR(shippingFee)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatIDR(total)}
              </span>
            </div>

            {/* Payment method selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
              <div className="space-y-2">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.code}
                      type="button"
                      onClick={() => setPaymentMethod(pm.code)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                        paymentMethod === pm.code
                          ? 'border-primary bg-primary/5 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{pm.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {(error || createOrder.error) && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error || String(createOrder.error)}
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              loading={isProcessing}
              disabled={isProcessing || !email || !address}
              onClick={handlePlaceOrder}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>

            <Link href="/cart">
              <Button variant="ghost" fullWidth>
                Back to cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
