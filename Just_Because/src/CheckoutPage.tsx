import React, { useState } from 'react';
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
  customerEmail?: string;
  customerName?: string;
  paymentMethod?: string;
}

interface CheckoutPageProps {
  cart: CustomBox[];
  setPage: (pageName: string) => void;
  onClearCart: () => void;
  onCheckout: (order: Order) => void;
  userEmail?: string;
  username?: string;
}

const boxTitles: Record<string, string> = {
  'for-her': 'For Her',
  'for-him': 'For Him',
  'build-a-box': 'Build-A-Box',
};

export default function CheckoutPage({ cart, setPage, onClearCart, onCheckout, userEmail, username }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Shipping Info
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');

  const calculateCartTotal = () => {
    return cart.reduce((sum, box) => sum + box.totalPrice, 0);
  };

  const subtotal = calculateCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const validateCreditCard = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!cardName || cardName.trim().length < 3) {
      newErrors.cardName = 'Please enter the name on card';
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!shippingName || shippingName.trim().length < 2) {
      newErrors.shippingName = 'Please enter shipping name';
    }
    if (!shippingAddress || shippingAddress.trim().length < 5) {
      newErrors.shippingAddress = 'Please enter shipping address';
    }
    if (!shippingCity || shippingCity.trim().length < 2) {
      newErrors.shippingCity = 'Please enter city';
    }
    if (!shippingZip || shippingZip.trim().length < 5) {
      newErrors.shippingZip = 'Please enter ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayPal = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingName || shippingName.trim().length < 2) {
      newErrors.shippingName = 'Please enter shipping name';
    }
    if (!shippingAddress || shippingAddress.trim().length < 5) {
      newErrors.shippingAddress = 'Please enter shipping address';
    }
    if (!shippingCity || shippingCity.trim().length < 2) {
      newErrors.shippingCity = 'Please enter city';
    }
    if (!shippingZip || shippingZip.trim().length < 5) {
      newErrors.shippingZip = 'Please enter ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    // Validate based on payment method
    const isValid = paymentMethod === 'credit' ? validateCreditCard() : validatePayPal();

    if (!isValid) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Create order object
      const order: Order = {
        orderId: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        boxes: cart,
        totalAmount: subtotal,
        tax: tax,
        grandTotal: total,
        customerEmail: userEmail,
        customerName: username || shippingName,
        paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 'PayPal'
      };

      // Save order globally for admin access
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Save to user profile
      onCheckout(order);

      // Clear cart
      onClearCart();

      setIsProcessing(false);

      // Show success message
      alert(`Payment Successful! 🎉\n\nOrder ID: ${order.orderId}\nTotal: $${order.grandTotal.toFixed(2)}\n\nYour order has been confirmed and will be shipped to:\n${shippingAddress}, ${shippingCity} ${shippingZip}\n\nThank you for your purchase!`);

      // Redirect to home
      setPage('home');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
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
            onClick={() => setPage('cart')}
            className="text-gray-700 hover:text-pink-500 font-semibold transition"
          >
            ← Back to Cart
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
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                      errors.shippingName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.shippingName && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                      errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                        errors.shippingCity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="New York"
                    />
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                        errors.shippingZip ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10001"
                    />
                    {errors.shippingZip && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingZip}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-4 rounded-xl border-2 transition ${
                    paymentMethod === 'credit'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">💳</div>
                  <div className="font-semibold text-gray-800">Credit Card</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border-2 transition ${
                    paymentMethod === 'paypal'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">🅿️</div>
                  <div className="font-semibold text-gray-800">PayPal</div>
                </motion.button>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-pink-500 transition ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl"
                >
                  <p className="text-blue-800 font-semibold mb-2">
                    🅿️ PayPal Payment
                  </p>
                  <p className="text-sm text-blue-700">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Payment Button */}
            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-3">⏳</span>
                  Processing Payment...
                </span>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cart.map((box) => (
                  <div key={box.id} className="border-b pb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {boxTitles[box.type]} Box
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {box.items.length} item{box.items.length !== 1 ? 's' : ''}
                    </p>
                    <p className="font-semibold text-gray-800">
                      ${box.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-semibold flex items-center">
                  <span className="mr-2">🔒</span>
                  Secure Payment
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
