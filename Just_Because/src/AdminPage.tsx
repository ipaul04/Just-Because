import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BoxItem {
  id: number;
  name: string;
  price: number;
}

interface Order {
  orderId: string;
  timestamp: string;
  customerEmail?: string;
  boxes: Array<{
    type: string;
    items: BoxItem[];
    totalPrice: number;
  }>;
  totalAmount: number;
  tax: number;
  grandTotal: number;
}

interface AdminPageProps {
  setPage: (pageName: string) => void;
  adminToken: string;
}

// Secret admin token (in production, this should be environment variable)
const ADMIN_SECRET_TOKEN = 'justbecause2025admin';

export default function AdminPage({ setPage, adminToken }: AdminPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    // Check if admin token is valid
    if (adminToken === ADMIN_SECRET_TOKEN) {
      setIsAuthenticated(true);
      loadOrders();
      loadSurveyResponses();
    }
  }, [adminToken]);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  };

  const loadSurveyResponses = () => {
    const storedResponses = localStorage.getItem('surveyResponses');
    if (storedResponses) {
      setSurveyResponses(JSON.parse(storedResponses));
    }
  };

  const exportOrdersToJSON = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportOrdersToCSV = () => {
    let csv = 'Order ID,Date,Customer Email,Box Type,Items,Total Price,Tax,Grand Total\n';

    orders.forEach(order => {
      order.boxes.forEach(box => {
        const items = box.items.map(item => item.name).join('; ');
        csv += `"${order.orderId}","${new Date(order.timestamp).toLocaleString()}","${order.customerEmail || 'N/A'}","${box.type}","${items}","$${box.totalPrice.toFixed(2)}","$${order.tax.toFixed(2)}","$${order.grandTotal.toFixed(2)}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportSurveyResponses = () => {
    const dataStr = JSON.stringify(surveyResponses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_responses_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllOrders = () => {
    if (window.confirm('Are you sure you want to clear all orders? This cannot be undone.')) {
      localStorage.removeItem('orders');
      setOrders([]);
    }
  };

  const clearAllSurveys = () => {
    if (window.confirm('Are you sure you want to clear all survey responses? This cannot be undone.')) {
      localStorage.removeItem('surveyResponses');
      setSurveyResponses([]);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_SECRET_TOKEN) {
      setIsAuthenticated(true);
      loadOrders();
      loadSurveyResponses();
    } else {
      alert('Invalid admin password. Access denied.');
      setPasswordInput('');
    }
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter the admin password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="adminPassword"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Access Admin Panel
              </button>
              <button
                type="button"
                onClick={() => setPage('home')}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Admin Link:</strong> Add <code className="bg-gray-200 px-2 py-1 rounded">?admin=justbecause2025admin</code> to the URL
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800">Just Because - Admin Dashboard</h1>
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
        className="max-w-7xl mx-auto p-8"
      >
        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Customer Orders</h2>
            <div className="flex space-x-3">
              <button
                onClick={exportOrdersToJSON}
                disabled={orders.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export JSON
              </button>
              <button
                onClick={exportOrdersToCSV}
                disabled={orders.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={clearAllOrders}
                disabled={orders.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="border-2 border-gray-200 rounded-xl p-6 hover:border-pink-300 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
                      <p className="text-gray-600">{new Date(order.timestamp).toLocaleString()}</p>
                      {order.customerEmail && (
                        <p className="text-gray-600">Email: {order.customerEmail}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">${order.grandTotal.toFixed(2)}</div>
                      <p className="text-sm text-gray-600">Tax: ${order.tax.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Items:</h4>
                    {order.boxes.map((box, index) => (
                      <div key={index} className="mb-3 bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-gray-800 mb-2">{box.type} Box - ${box.totalPrice.toFixed(2)}</p>
                        <ul className="space-y-1 ml-4">
                          {box.items.map((item) => (
                            <li key={item.id} className="text-gray-600 text-sm">
                              • {item.name} - ${item.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Survey Responses Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Survey Responses</h2>
            <div className="flex space-x-3">
              <button
                onClick={exportSurveyResponses}
                disabled={surveyResponses.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export JSON
              </button>
              <button
                onClick={clearAllSurveys}
                disabled={surveyResponses.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
          </div>

          {surveyResponses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No survey responses yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {surveyResponses.map((response) => (
                <div key={response.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {new Date(response.timestamp).toLocaleString()}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Feeling:</span> {response.feeling}</p>
                    <p className="text-gray-700"><span className="font-semibold">What made them smile:</span> {response.smile}</p>
                    {response.message && (
                      <p className="text-gray-700"><span className="font-semibold">Message:</span> {response.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
