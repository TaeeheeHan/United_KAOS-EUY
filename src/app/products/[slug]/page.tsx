'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import type { ProductColor, Size } from '@/types';
import { getProductBySlug } from '@/lib/mock-data';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ColorSelector } from '@/components/products/ColorSelector';
import { SizeSelector } from '@/components/products/SizeSelector';
import { QuantitySelector } from '@/components/products/QuantitySelector';
import { formatIDR } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { t } = useLanguage();
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(t('products.pleaseSelectSize'));
      return;
    }

    addItem(product, selectedSize, selectedColor, quantity);
    alert(t('products.addedToCart'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          {' / '}
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          {' / '}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
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
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Badges */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                {product.in_stock ? (
                  <Badge variant="success" dot>
                    {t('products.inStock')}
                  </Badge>
                ) : (
                  <Badge variant="danger" dot>
                    {t('products.outOfStock')}
                  </Badge>
                )}
                {product.is_customizable && (
                  <Badge variant="primary">{t('products.customizable')}</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="text-4xl font-bold text-primary">
                {formatIDR(product.price)}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <ColorSelector
              colors={product.colors}
              selected={selectedColor}
              onChange={setSelectedColor}
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onChange={setSelectedSize}
            />

            {/* Quantity */}
            <QuantitySelector value={quantity} onChange={setQuantity} />

            {/* Action Buttons */}
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

            {/* Customization Option */}
            {product.is_customizable && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('products.customizeProduct')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('products.customizeDescription')}
                </p>
                <Link href={`/custom-order?base=${product.id}`}>
                  <Button variant="outline" size="sm">
                    {t('products.customOrderBtn')}
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
