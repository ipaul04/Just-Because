import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BoxItem {
  id: number;
  name: string;
  price: number;
  included: boolean;
}

interface SurveyResponses {
  style: string;
  productTypes: string[];
  interests: string[];
  priceRange: string;
  occasion: string;
}

interface BoxCustomizationPageProps {
  boxType: string;
  setPage: (pageName: string) => void;
  onAddToCart: (box: CustomBox) => void;
  userSurvey?: SurveyResponses;
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
    { id: 4, name: 'Rose Gold Bracelet', price: 24.99, included: false },
    { id: 5, name: 'Premium Chocolate Truffles', price: 18.99, included: false },
    { id: 6, name: 'Aromatherapy Essential Oil Set', price: 22.99, included: false },
    { id: 7, name: 'Personalized Journal', price: 14.99, included: false },
    { id: 8, name: 'Floral Tea Collection', price: 16.99, included: false },
  ],
  'for-him': [
    { id: 1, name: 'Premium Leather Wallet', price: 29.99, included: true },
    { id: 2, name: 'Artisan Coffee Blend', price: 18.99, included: true },
    { id: 3, name: 'Grooming Kit', price: 24.99, included: true },
    { id: 4, name: 'Stainless Steel Watch', price: 45.99, included: false },
    { id: 5, name: 'Gourmet Beef Jerky', price: 15.99, included: false },
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

export default function BoxCustomizationPage({ boxType, setPage, onAddToCart, userSurvey }: BoxCustomizationPageProps) {
  const [items, setItems] = useState<BoxItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize items based on box type
    setItems(boxDefaults[boxType] || []);
  }, [boxType]);

  const toggleItem = (itemId: number) => {
    setErrorMessage(''); // Clear error when user makes changes
    setItems(items.map(item =>
      item.id === itemId ? { ...item, included: !item.included } : item
    ));
  };

  const BASE_PRICE = 49.99;
  const BASE_ITEMS = 3;
  const MIN_ITEMS = 3;

  const calculateTotal = () => {
    const includedItems = items.filter(item => item.included);
    const itemCount = includedItems.length;

    if (itemCount === 0) return 0;
    if (itemCount <= BASE_ITEMS) return BASE_PRICE;

    // For more than 3 items: $49.99 + sum of additional items' prices
    const additionalItems = includedItems.slice(BASE_ITEMS);
    const additionalCost = additionalItems.reduce((sum, item) => sum + item.price, 0);
    return BASE_PRICE + additionalCost;
  };

  const isRecommended = (item: BoxItem): boolean => {
    if (!userSurvey) return false;

    const itemName = item.name.toLowerCase();
    const { style, productTypes, interests } = userSurvey;

    // Match based on style
    if (style === 'luxury' && (itemName.includes('premium') || itemName.includes('luxurious') || itemName.includes('silk') || itemName.includes('gold'))) {
      return true;
    }
    if (style === 'casual' && (itemName.includes('coffee') || itemName.includes('snack') || itemName.includes('mug'))) {
      return true;
    }
    if (style === 'elegant' && (itemName.includes('bracelet') || itemName.includes('watch') || itemName.includes('journal'))) {
      return true;
    }

    // Match based on product types
    if (productTypes.includes('beauty') && (itemName.includes('bath') || itemName.includes('candle') || itemName.includes('aromatherapy') || itemName.includes('soap') || itemName.includes('grooming'))) {
      return true;
    }
    if (productTypes.includes('food') && (itemName.includes('chocolate') || itemName.includes('coffee') || itemName.includes('jerky') || itemName.includes('beer') || itemName.includes('snack') || itemName.includes('popcorn') || itemName.includes('tea'))) {
      return true;
    }
    if (productTypes.includes('accessories') && (itemName.includes('bracelet') || itemName.includes('wallet') || itemName.includes('watch') || itemName.includes('earbuds') || itemName.includes('organizer'))) {
      return true;
    }
    if (productTypes.includes('home') && (itemName.includes('candle') || itemName.includes('frame') || itemName.includes('mug'))) {
      return true;
    }

    // Match based on interests
    if (interests.includes('wellness') && (itemName.includes('aromatherapy') || itemName.includes('tea') || itemName.includes('bath') || itemName.includes('sleep'))) {
      return true;
    }
    if (interests.includes('fashion') && (itemName.includes('bracelet') || itemName.includes('watch') || itemName.includes('mask'))) {
      return true;
    }
    if (interests.includes('tech') && (itemName.includes('earbuds') || itemName.includes('organizer'))) {
      return true;
    }
    if (interests.includes('food') && (itemName.includes('chocolate') || itemName.includes('coffee') || itemName.includes('gourmet') || itemName.includes('wine'))) {
      return true;
    }

    return false;
  };

  const handleAddToCart = () => {
    const includedItems = items.filter(item => item.included);

    // Validate minimum items
    if (includedItems.length < MIN_ITEMS) {
      setErrorMessage(`Please select at least ${MIN_ITEMS} items to create your box.`);
      return;
    }

    const customBox: CustomBox = {
      id: Date.now(),
      type: boxType,
      items: includedItems,
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

          {userSurvey && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✨ Items marked with a star are recommended based on your preferences!
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <p className="text-red-700 font-semibold flex items-center">
                <span className="mr-2">⚠️</span>
                {errorMessage}
              </p>
            </div>
          )}

          {/* Summary Bar */}
          <div className={`${color.bgGradient} rounded-xl p-4 mb-6`}>
            <div className="flex justify-between items-center">
              <div>
                <span className={`font-semibold ${includedCount < MIN_ITEMS ? 'text-red-600' : 'text-gray-700'}`}>
                  {includedCount} item{includedCount !== 1 ? 's' : ''} selected
                  {includedCount < MIN_ITEMS && ` (minimum ${MIN_ITEMS} required)`}
                </span>
                {includedCount <= BASE_ITEMS ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Base price for up to {BASE_ITEMS} items: ${BASE_PRICE.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    Base: ${BASE_PRICE.toFixed(2)} + {includedCount - BASE_ITEMS} extra item{includedCount - BASE_ITEMS !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const recommended = isRecommended(item);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                    item.included
                      ? `${color.borderActiveClass} ${color.bgActiveClass}`
                      : recommended
                      ? 'border-green-300 bg-green-50'
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
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          {item.name}
                          {recommended && <span className="text-yellow-500">⭐</span>}
                        </h3>
                        {recommended && (
                          <p className="text-xs text-green-600 mt-1">Recommended for you</p>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: includedCount >= MIN_ITEMS ? 1.05 : 1 }}
              whileTap={{ scale: includedCount >= MIN_ITEMS ? 0.95 : 1 }}
              onClick={handleAddToCart}
              disabled={includedCount < MIN_ITEMS}
              className={`flex-1 ${color.buttonClass} ${color.buttonHoverClass} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add to Cart ({includedCount} item{includedCount !== 1 ? 's' : ''})
              {includedCount < MIN_ITEMS && ` - Need ${MIN_ITEMS - includedCount} more`}
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
