import React from 'react';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  setPage: (pageName: string) => void;
}

export default function WelcomePage({ setPage }: WelcomePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-8"
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <img src="/logo.png" alt="Main Logo" className="w-64 h-64 object-contain mb-8" />
        <h1 className="text-5xl font-bold text-white mb-6">Love needs no reason</h1>
        <p className="text-lg text-white mb-8 max-w-xl">
          Discover and share heartfelt moments.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('home')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg transition"
        >
          Enter
        </motion.button>
      </div>
    </motion.div>
  );
}