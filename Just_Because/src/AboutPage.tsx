import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  setPage: (pageName: string) => void;
}

export default function AboutPage({ setPage }: AboutPageProps) {
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
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">💝</span>
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            About Just Because
          </h1>
          <p className="text-xl text-gray-600 italic">
            Celebrating life's moments, one thoughtful gift at a time
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🌟</span>
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At <span className="font-semibold text-pink-600">Just Because</span>, we believe that the best gifts
            don't need a reason. Sometimes, the most meaningful gestures are the ones that happen "just because"
            you care, "just because" you're thinking of someone, or "just because" you want to bring a smile to
            someone's face.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our mission is to make thoughtful gifting effortless and personal. We curate beautiful, high-quality
            products and combine them into customizable gift boxes that speak from the heart. Whether you're
            celebrating a milestone or simply brightening someone's day, we're here to help you create moments
            of joy and connection.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Thoughtful Curation</h3>
            <p className="text-gray-600">
              Every item in our boxes is carefully selected for quality, beauty, and the joy it brings. We
              partner with artisans and trusted brands to bring you products that matter.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personalization</h3>
            <p className="text-gray-600">
              Your gift should be as unique as the person receiving it. Our survey-based recommendations and
              customization options ensure every box feels personal and special.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="text-4xl mb-4">💖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Connection</h3>
            <p className="text-gray-600">
              We believe gifts are bridges between hearts. Whether near or far, our boxes help you express
              love, gratitude, and appreciation in meaningful ways.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="text-4xl mb-4">🌈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Joy & Delight</h3>
            <p className="text-gray-600">
              From the moment you start customizing to the smile on your recipient's face, we're committed
              to making every step of the gifting journey delightful.
            </p>
          </motion.div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📖</span>
            Our Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Just Because was born from a simple observation: some of life's most treasured moments aren't
            tied to holidays or special occasions. They're the everyday acts of kindness, the spontaneous
            expressions of love, and the thoughtful gestures that remind us we're valued.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We started with a vision to create a gifting experience that celebrates these authentic moments.
            By combining carefully curated products with personalized recommendations, we've built a platform
            that makes it easy to show someone you care—just because.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Today, we're proud to help thousands of people create meaningful connections through thoughtful,
            personalized gifts. Every box we send carries with it a piece of that original vision: to
            celebrate the beautiful, ordinary, extraordinary moments that make life special.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to create your perfect gift?
          </h2>
          <p className="text-gray-600 mb-6">
            Start customizing a box today and make someone's day a little brighter.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('home')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition"
          >
            Start Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
