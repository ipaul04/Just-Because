import React from 'react';
import { motion } from 'framer-motion';

interface BoxItem {
  id: number;
  name: string;
  price: number;
  included: boolean;
}

interface CustomBox {
  id: number;
  type: string;
  items: BoxItem[];
  totalPrice: number;
}

interface Order {
  orderId: string;
  timestamp: string;
  boxes: CustomBox[];
  totalAmount: number;
  tax: number;
  grandTotal: number;
}

interface CartPageProps {
  cart: CustomBox[];
  setPage: (pageName: string) => void;
  onRemoveFromCart: (boxId: number) => void;
  onClearCart: () => void;
  onCheckout: (order: Order) => void;
}

const boxTitles: Record<string, string> = {
  'for-her': 'For Her',
  'for-him': 'For Him',
  'build-a-box': 'Build-A-Box',
};

export default function CartPage({ cart, setPage, onRemoveFromCart, onClearCart, onCheckout }: CartPageProps) {
  const calculateCartTotal = () => {
    return cart.reduce((sum, box) => sum + box.totalPrice, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Create order object
    const order: Order = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      boxes: cart,
      totalAmount: calculateCartTotal(),
      tax: calculateCartTotal() * 0.08,
      grandTotal: calculateCartTotal() * 1.08
    };

    // Save order to user profile via onCheckout
    onCheckout(order);

    // Clear cart
    onClearCart();

    // Show success message and redirect
    alert(`Order placed successfully!\n\nOrder ID: ${order.orderId}\nTotal: $${order.grandTotal.toFixed(2)}\n\nThank you for your purchase!`);
    setPage('home');
  };

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
            ← Continue Shopping
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-8"
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some beautiful gift boxes to get started!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage('home')}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Start Shopping
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((box) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {boxTitles[box.type]} Box
                      </h3>
                      <p className="text-gray-600">
                        {box.items.length} item{box.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        ${box.totalPrice.toFixed(2)}
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(box.id)}
                        className="text-red-500 hover:text-red-700 font-semibold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Box Items List */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Included Items:</h4>
                    <ul className="space-y-2">
                      {box.items.map((item) => (
                        <li key={item.id} className="flex justify-between text-gray-600">
                          <span>• {item.name}</span>
                          <span className="font-semibold">${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">${(calculateCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>${(calculateCartTotal() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition mb-4"
                >
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={() => setPage('home')}
                  className="w-full text-gray-600 hover:text-gray-800 font-semibold transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
