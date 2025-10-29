import React from 'react';
import { motion } from 'framer-motion';

interface User {
  username: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface HomePageProps {
  user: User | null;
  setPage: (pageName: string) => void;
  handleLogout: () => void;
  onAddToCart: (product: Product) => void;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Gift Basket Deluxe',
    price: 49.99,
    image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=GiftBasket',
  },
  {
    id: 2,
    name: 'Custom Mug',
    price: 12.50,
    image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=CustomMug',
  },
  {
    id: 3,
    name: 'Personalized Keychain',
    price: 7.99,
    image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Keychain',
  },
  {
    id: 4,
    name: 'Handmade Soap Set',
    price: 24.00,
    image: 'https://via.placeholder.com/150/FFFF33/000000?text=SoapSet',
  },
];

export default function HomePage({ user, setPage, handleLogout, onAddToCart }: HomePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-bold mb-6">Welcome, {user?.username}!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Explore our wonderful selection of gifts, just because.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mb-4" />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('survey')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg transition"
        >
          Take Survey
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-2xl shadow-lg transition"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}