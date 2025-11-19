import React from 'react';
import { motion } from 'framer-motion';

interface User {
  username: string;
  email: string;
  surveyResponses?: any;
  orderHistory: any[];
  createdAt: string;
}

interface HomePageProps {
  setPage: (pageName: string) => void;
  onSelectBox: (boxType: string) => void;
  cartCount: number;
  user: User | null;
  onLogout: () => void;
}

export default function HomePage({ setPage, onSelectBox, cartCount, user, onLogout }: HomePageProps) {
  const handleBoxClick = (boxType: string) => {
    onSelectBox(boxType);
    setPage('customize');
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
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setPage('about')}
              className="text-gray-700 hover:text-pink-500 font-semibold transition"
            >
              About
            </button>

            {user && user.surveyResponses && (
              <button
                onClick={() => setPage('recommendations')}
                className="text-gray-700 hover:text-pink-500 font-semibold transition"
              >
                Recommendations
              </button>
            )}

            {user && !user.surveyResponses && (
              <button
                onClick={() => setPage('survey')}
                className="text-gray-700 hover:text-pink-500 font-semibold transition"
              >
                Take Survey
              </button>
            )}

            <button
              onClick={() => setPage('cart')}
              className="text-gray-700 hover:text-pink-500 font-semibold transition relative"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPage('profile')}
                  className="text-gray-700 hover:text-pink-500 font-semibold transition"
                >
                  Profile
                </button>
                <button
                  onClick={onLogout}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPage('login')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-8"
      >
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Choose Your Perfect Box</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-xl">
          Select from our curated gift boxes or create your own custom experience.
        </p>

        {/* Three Box Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {/* For Her Box */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBoxClick('for-her')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-4 border-pink-200 hover:border-pink-400 transition"
          >
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
                <span className="text-6xl">💝</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-pink-600 mb-4">For Her</h2>
            <p className="text-gray-600 mb-6">
              A curated collection of thoughtful gifts perfect for the special woman in your life.
            </p>
            <div className="text-2xl font-bold text-gray-800 mb-4">$49.99</div>
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl w-full font-semibold transition">
              Customize Box
            </button>
          </motion.div>

          {/* For Him Box */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBoxClick('for-him')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-4 border-blue-200 hover:border-blue-400 transition"
          >
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full flex items-center justify-center">
                <span className="text-6xl">🎁</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">For Him</h2>
            <p className="text-gray-600 mb-6">
              Handpicked items designed to surprise and delight the special man in your life.
            </p>
            <div className="text-2xl font-bold text-gray-800 mb-4">$49.99</div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl w-full font-semibold transition">
              Customize Box
            </button>
          </motion.div>

          {/* Build-A-Box */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBoxClick('build-a-box')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-4 border-purple-200 hover:border-purple-400 transition"
          >
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
                <span className="text-6xl">🎨</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-purple-600 mb-4">Build-A-Box</h2>
            <p className="text-gray-600 mb-6">
              Create your own unique gift box by selecting exactly what you want to include.
            </p>
            <div className="text-2xl font-bold text-gray-800 mb-4">Custom Price</div>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl w-full font-semibold transition">
              Customize Box
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}