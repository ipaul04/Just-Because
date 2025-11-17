import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BoxItem {
  id: number;
  name: string;
  price: number;
  included: boolean;
}

interface BoxCustomizationPageProps {
  boxType: string;
  setPage: (pageName: string) => void;
  onAddToCart: (box: CustomBox) => void;
}

interface CustomBox {
  id: number;
  type: string;
  items: BoxItem[];
  totalPrice: number;
}

const boxDefaults: Record<string, BoxItem[]> = {
  'for-her': [
    { id: 1, name: 'Scented Candle', price: 12.99, included: true },
    { id: 2, name: 'Luxurious Bath Bombs', price: 15.99, included: true },
    { id: 3, name: 'Silk Sleep Mask', price: 8.99, included: true },
    { id: 4, name: 'Rose Gold Bracelet', price: 24.99, included: true },
    { id: 5, name: 'Premium Chocolate Truffles', price: 18.99, included: true },
    { id: 6, name: 'Aromatherapy Essential Oil Set', price: 22.99, included: true },
    { id: 7, name: 'Personalized Journal', price: 14.99, included: false },
    { id: 8, name: 'Floral Tea Collection', price: 16.99, included: false },
  ],
  'for-him': [
    { id: 1, name: 'Premium Leather Wallet', price: 29.99, included: true },
    { id: 2, name: 'Artisan Coffee Blend', price: 18.99, included: true },
    { id: 3, name: 'Grooming Kit', price: 24.99, included: true },
    { id: 4, name: 'Stainless Steel Watch', price: 45.99, included: true },
    { id: 5, name: 'Gourmet Beef Jerky', price: 15.99, included: true },
    { id: 6, name: 'Wireless Earbuds', price: 39.99, included: false },
    { id: 7, name: 'Craft Beer Selection', price: 22.99, included: false },
    { id: 8, name: 'Tech Organizer Pouch', price: 19.99, included: false },
  ],
  'build-a-box': [
    { id: 1, name: 'Scented Candle', price: 12.99, included: false },
    { id: 2, name: 'Luxurious Bath Bombs', price: 15.99, included: false },
    { id: 3, name: 'Premium Chocolate Truffles', price: 18.99, included: false },
    { id: 4, name: 'Artisan Coffee Blend', price: 18.99, included: false },
    { id: 5, name: 'Gourmet Snack Mix', price: 14.99, included: false },
    { id: 6, name: 'Personalized Mug', price: 16.99, included: false },
    { id: 7, name: 'Custom Photo Frame', price: 19.99, included: false },
    { id: 8, name: 'Handmade Soap Set', price: 24.99, included: false },
    { id: 9, name: 'Wine Bottle', price: 29.99, included: false },
    { id: 10, name: 'Gourmet Popcorn', price: 12.99, included: false },
  ],
};

const boxTitles: Record<string, string> = {
  'for-her': 'For Her',
  'for-him': 'For Him',
  'build-a-box': 'Build-A-Box',
};

const boxColors: Record<string, {
  titleClass: string;
  bgGradient: string;
  borderClass: string;
  borderActiveClass: string;
  bgActiveClass: string;
  buttonClass: string;
  buttonHoverClass: string;
  accentClass: string;
}> = {
  'for-her': {
    titleClass: 'text-pink-600',
    bgGradient: 'bg-gradient-to-r from-pink-100 to-purple-100',
    borderClass: 'border-gray-200',
    borderActiveClass: 'border-pink-400',
    bgActiveClass: 'bg-pink-50',
    buttonClass: 'bg-pink-500',
    buttonHoverClass: 'hover:bg-pink-600',
    accentClass: 'accent-pink-500'
  },
  'for-him': {
    titleClass: 'text-blue-600',
    bgGradient: 'bg-gradient-to-r from-blue-100 to-indigo-100',
    borderClass: 'border-gray-200',
    borderActiveClass: 'border-blue-400',
    bgActiveClass: 'bg-blue-50',
    buttonClass: 'bg-blue-500',
    buttonHoverClass: 'hover:bg-blue-600',
    accentClass: 'accent-blue-500'
  },
  'build-a-box': {
    titleClass: 'text-purple-600',
    bgGradient: 'bg-gradient-to-r from-purple-100 to-pink-100',
    borderClass: 'border-gray-200',
    borderActiveClass: 'border-purple-400',
    bgActiveClass: 'bg-purple-50',
    buttonClass: 'bg-purple-500',
    buttonHoverClass: 'hover:bg-purple-600',
    accentClass: 'accent-purple-500'
  },
};

export default function BoxCustomizationPage({ boxType, setPage, onAddToCart }: BoxCustomizationPageProps) {
  const [items, setItems] = useState<BoxItem[]>([]);

  useEffect(() => {
    // Initialize items based on box type
    setItems(boxDefaults[boxType] || []);
  }, [boxType]);

  const toggleItem = (itemId: number) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, included: !item.included } : item
    ));
  };

  const calculateTotal = () => {
    return items
      .filter(item => item.included)
      .reduce((sum, item) => sum + item.price, 0);
  };

  const handleAddToCart = () => {
    const customBox: CustomBox = {
      id: Date.now(),
      type: boxType,
      items: items.filter(item => item.included),
      totalPrice: calculateTotal(),
    };
    onAddToCart(customBox);
    setPage('cart');
  };

  const color = boxColors[boxType] || boxColors['build-a-box'];
  const includedCount = items.filter(item => item.included).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800">Just Because</h1>
          </div>
          <button
            onClick={() => setPage('home')}
            className="text-gray-700 hover:text-pink-500 font-semibold transition"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${color.titleClass}`}>
            Customize Your {boxTitles[boxType]} Box
          </h1>
          <p className="text-gray-600 mb-6">
            Select the items you'd like to include in your personalized gift box.
            {boxType === 'build-a-box'
              ? ' Build your perfect box from scratch!'
              : ' Default items are pre-selected, but you can customize as you wish!'}
          </p>

          {/* Summary Bar */}
          <div className={`${color.bgGradient} rounded-xl p-4 mb-6`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700 font-semibold">
                  {includedCount} item{includedCount !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                  item.included
                    ? `${color.borderActiveClass} ${color.bgActiveClass}`
                    : `${color.borderClass} bg-white`
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded cursor-pointer ${color.accentClass}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={includedCount === 0}
              className={`flex-1 ${color.buttonClass} ${color.buttonHoverClass} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add to Cart ({includedCount} item{includedCount !== 1 ? 's' : ''})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage('home')}
              className="px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-semibold text-lg shadow-lg transition"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
