import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface User {
  username: string;
  email: string;
  surveyResponses?: any;
  orderHistory: Order[];
  createdAt: string;
  profilePicture?: string;
}

interface Order {
  orderId: string;
  timestamp: string;
  boxes: any[];
  totalAmount: number;
  tax: number;
  grandTotal: number;
}

interface ProfilePageProps {
  user: User;
  setPage: (pageName: string) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => boolean;
}

export default function ProfilePage({ user, setPage, onUpdateUser, onChangePassword }: ProfilePageProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateUser({ profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    const success = onChangePassword(currentPassword, newPassword);
    if (success) {
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError('Current password is incorrect');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            ← Back to Home
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
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center overflow-hidden mx-auto mb-4">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-white">{user.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <span className="text-sm">📷</span>
                  </label>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {formatDate(user.createdAt).split(',')[0]}
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage('survey')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold transition"
                >
                  {user.surveyResponses ? '✏️ Update Preferences' : '📝 Take Survey'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition"
                >
                  🔒 Change Password
                </motion.button>
              </div>

              {/* Change Password Form */}
              {isChangingPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t"
                >
                  <form onSubmit={handlePasswordChange} className="space-y-3">
                    {passwordError && (
                      <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
                        {passwordSuccess}
                      </div>
                    )}
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Update Password
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order History</h3>

              {user.orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600 text-lg">No orders yet</p>
                  <p className="text-gray-500 mt-2">Start shopping to see your orders here!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage('home')}
                    className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Start Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...user.orderHistory].reverse().map((order) => (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-pink-300 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">Order #{order.orderId}</h4>
                          <p className="text-sm text-gray-600">{formatDate(order.timestamp)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-pink-600">${order.grandTotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">including tax</p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {order.boxes.length} Box{order.boxes.length !== 1 ? 'es' : ''}:
                        </p>
                        <ul className="space-y-1">
                          {order.boxes.map((box, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              • {box.type === 'for-her' ? 'For Her' : box.type === 'for-him' ? 'For Him' : 'Build-A-Box'} - {box.items.length} items (${box.totalPrice.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
