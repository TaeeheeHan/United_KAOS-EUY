'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
  Upload,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { formatIDR } from '@/lib/utils';

interface ProductColor {
  name: string;
  hex: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: string;
  isCustomizable: boolean;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  createdAt: string;
}

// Mock data for demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Kaos Bandung Pride',
    slug: 'kaos-bandung-pride',
    description: 'Premium cotton t-shirt with Bandung-inspired design',
    basePrice: 150000,
    category: 'T-Shirt',
    isCustomizable: true,
    colors: [
      { name: 'Black', hex: '#000000', stock: 50 },
      { name: 'White', hex: '#FFFFFF', stock: 35 },
      { name: 'Navy', hex: '#1E3A5F', stock: 20 },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Premium Hoodie EUY',
    slug: 'premium-hoodie-euy',
    description: 'Comfortable hoodie with premium fabric',
    basePrice: 350000,
    category: 'Hoodie',
    isCustomizable: true,
    colors: [
      { name: 'Black', hex: '#000000', stock: 25 },
      { name: 'Gray', hex: '#6B7280', stock: 30 },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Polo Shirt Classic',
    slug: 'polo-shirt-classic',
    description: 'Classic polo shirt for business casual',
    basePrice: 200000,
    category: 'Polo',
    isCustomizable: false,
    colors: [
      { name: 'White', hex: '#FFFFFF', stock: 40 },
      { name: 'Navy', hex: '#1E3A5F', stock: 45 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const categories = ['All', 'T-Shirt', 'Hoodie', 'Polo', 'Long Sleeve'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const availableColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Yellow', hex: '#EAB308' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: 0,
    category: 'T-Shirt',
    isCustomizable: true,
    colors: [] as ProductColor[],
    sizes: [] as string[],
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      basePrice: 0,
      category: 'T-Shirt',
      isCustomizable: true,
      colors: [],
      sizes: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      isCustomizable: product.isCustomizable,
      colors: [...product.colors],
      sizes: [...product.sizes],
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      // Update existing
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      );
    } else {
      // Add new
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        images: [],
        createdAt: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    setFormData((prev) => {
      const exists = prev.colors.find((c) => c.name === color.name);
      if (exists) {
        return {
          ...prev,
          colors: prev.colors.filter((c) => c.name !== color.name),
        };
      } else {
        return {
          ...prev,
          colors: [...prev.colors, { ...color, stock: 0 }],
        };
      }
    });
  };

  const updateColorStock = (colorName: string, stock: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.name === colorName ? { ...c, stock } : c
      ),
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Button variant="primary" leftIcon={Plus} onClick={openAddModal}>
          Add Product
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Product Image */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {product.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-300" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                {product.isCustomizable && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Customizable
                  </span>
                )}
              </div>

              <p className="text-lg font-bold text-primary mb-3">
                {formatIDR(product.basePrice)}
              </p>

              {/* Colors */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.stock} in stock)`}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Sizes:</span>
                <div className="flex gap-1">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  leftIcon={Edit2}
                  onClick={() => openEditModal(product)}
                >
                  Edit
                </Button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
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
                <h2 className="text-lg font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                      placeholder="product-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Product description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price (IDR)
                      </label>
                      <input
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            basePrice: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="150000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {categories.slice(1).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customizable Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Customizable</h3>
                    <p className="text-sm text-gray-500">
                      Allow customers to add custom designs to this product
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isCustomizable: !formData.isCustomizable,
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isCustomizable ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        formData.isCustomizable ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <Separator />

                {/* Sizes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          formData.sizes.includes(size)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Colors */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Available Colors & Stock
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {availableColors.map((color) => {
                      const isSelected = formData.colors.some(
                        (c) => c.name === color.name
                      );
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color)}
                          className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-primary scale-110'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check
                              className={`w-5 h-5 absolute inset-0 m-auto ${
                                color.hex === '#FFFFFF'
                                  ? 'text-gray-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock per color */}
                  {formData.colors.length > 0 && (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        Stock per color:
                      </p>
                      {formData.colors.map((color) => (
                        <div
                          key={color.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm text-gray-700 w-20">
                            {color.name}
                          </span>
                          <input
                            type="number"
                            value={color.stock}
                            onChange={(e) =>
                              updateColorStock(
                                color.name,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-500">units</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Image Upload Placeholder */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Product Images
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSave}
                    disabled={!formData.name || formData.basePrice <= 0}
                  >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Delete Product?
                </h3>
                <p className="text-gray-500 mb-6">
                  This action cannot be undone. The product will be permanently
                  removed from your catalog.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
