import React from 'react';
import { motion } from 'framer-motion';
import BackgroundSlideshow from './BackgroundSlideshow';

interface LoginPageProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}

const slideshowImages = [
  '/slideshow/image1.png', // Placeholder - User should replace with actual images in public/slideshow
  '/slideshow/image2.png', // Placeholder
  '/slideshow/image3.png', // Placeholder
];

export default function LoginPage({ handleLogin }: LoginPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen p-8"
    >
      <BackgroundSlideshow images={slideshowImages} />
      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Just Because</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input name="username" placeholder="Username" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400" required />
          <input name="password" type="password" placeholder="Password" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400" required />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition font-semibold">Login</button>
        </form>
      </div>
    </motion.div>
  );
}