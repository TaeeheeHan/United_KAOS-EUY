'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Palette, ChevronRight } from 'lucide-react';
import type { ProductColor, Size } from '@/types';
import { getProductBySlug } from '@/lib/mock-data';
import { useCartStore } from '@/stores/cart';
import { useCustomDesignStore } from '@/stores/customDesign';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Separator } from '@/components/common/Separator';
import { ColorSelector } from '@/components/products/ColorSelector';
import { SizeSelector } from '@/components/products/SizeSelector';
import { QuantitySelector } from '@/components/products/QuantitySelector';
import { CustomVisualizer } from '@/components/custom/CustomVisualizer';
import { PositionSelector } from '@/components/custom/PositionSelector';
import { DesignUploader } from '@/components/custom/DesignUploader';
import { formatIDR } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

type ViewMode = 'product' | 'customize';

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { t } = useLanguage();
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customStep, setCustomStep] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const { getCustomPrice, resetAll, getAppliedParts } = useCustomDesignStore();

  const customPrice = getCustomPrice();
  const totalPrice = product.price + customPrice;
  const appliedParts = getAppliedParts();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(t('products.pleaseSelectSize'));
      return;
    }

    addItem(product, selectedSize, selectedColor, quantity);

    if (viewMode === 'customize') {
      resetAll();
    }

    alert(`${product.name} ${t('products.addedToCart')}`);
  };

  const handleStartCustomize = () => {
    setViewMode('customize');
    setCustomStep(1);
  };

  const handleBackToProduct = () => {
    setViewMode('product');
    setCustomStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
          {viewMode === 'customize' && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary">Customize</span>
            </>
          )}
        </div>

        {viewMode === 'product' ? (
          /* Standard Product View */
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  {product.in_stock ? (
                    <Badge variant="success" dot>{t('products.inStock')}</Badge>
                  ) : (
                    <Badge variant="danger" dot>{t('products.outOfStock')}</Badge>
                  )}
                  {product.is_customizable && (
                    <Badge variant="primary">{t('products.customizable')}</Badge>
                  )}
                </div>
              </div>

              <div className="py-4 border-y border-gray-200">
                <div className="text-4xl font-bold text-primary">
                  {formatIDR(product.price)}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onChange={setSelectedColor}
              />

              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
              />

              <QuantitySelector value={quantity} onChange={setQuantity} />

              <div className="space-y-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  leftIcon={ShoppingCart}
                >
                  {t('products.addToCart')}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="md" leftIcon={Heart}>
                    {t('products.addToWishlist')}
                  </Button>
                  <Button variant="outline" size="md" leftIcon={Share2}>
                    {t('products.share')}
                  </Button>
                </div>
              </div>

              {/* Customization CTA */}
              {product.is_customizable && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {t('products.customizeProduct')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add your own design to front, back, or sleeves. Make it unique!
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleStartCustomize}
                        rightIcon={ChevronRight}
                      >
                        Start Customizing
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Customize View */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Visualizer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sticky top-24">
                <CustomVisualizer
                  baseColor={selectedColor.code}
                  productImage={product.images[0]}
                />
              </div>
            </motion.div>

            {/* Right: Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-gray-500">Customize your design</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBackToProduct}>
                  Back to Product
                </Button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCustomStep(step)}
                    className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-all ${
                      customStep === step
                        ? 'bg-primary text-white'
                        : customStep > step
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {step === 1 && 'Options'}
                    {step === 2 && 'Position'}
                    {step === 3 && 'Design'}
                  </button>
                ))}
              </div>

              <Separator />

              {/* Step Content */}
              <div className="min-h-[300px]">
                {customStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <ColorSelector
                      colors={product.colors}
                      selected={selectedColor}
                      onChange={setSelectedColor}
                    />
                    <SizeSelector
                      sizes={product.sizes}
                      selected={selectedSize}
                      onChange={setSelectedSize}
                    />
                    <QuantitySelector value={quantity} onChange={setQuantity} />
                  </motion.div>
                )}

                {customStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <PositionSelector />
                  </motion.div>
                )}

                {customStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <DesignUploader />
                  </motion.div>
                )}
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Base Price</span>
                  <span>{formatIDR(product.price)}</span>
                </div>
                {customPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Custom ({appliedParts.length} position{appliedParts.length > 1 ? 's' : ''})</span>
                    <span>+{formatIDR(customPrice)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatIDR(totalPrice * quantity)}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {customStep > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCustomStep(customStep - 1)}
                  >
                    Back
                  </Button>
                )}
                {customStep < 3 ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setCustomStep(customStep + 1)}
                    disabled={customStep === 1 && !selectedSize}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    leftIcon={ShoppingCart}
                  >
                    Add to Cart - {formatIDR(totalPrice * quantity)}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
