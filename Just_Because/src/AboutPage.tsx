import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  setPage: (pageName: string) => void;
}

interface BoardMember {
  name: string;
  title: string;
  image: string;
}

const boardMembers: BoardMember[] = [
  {
    name: 'Aedan Hannigan',
    title: 'CEO and CFO - Chief Executive Officer and Chief Financial Officer',
    image: '/carousell/Aedan.jpg'
  },
  {
    name: 'Jack Ehrlich',
    title: 'COO - Chief Operating Officer',
    image: '/carousell/jack.JPEG'
  },
  {
    name: 'Irene Paul',
    title: 'CTO - Chief Technology Officer',
    image: '/carousell/Irene.png'
  },
  {
    name: 'Conor Marquez',
    title: 'CPO - Chief Product Officer',
    image: '/carousell/conor.jpeg'
  },
  {
    name: 'Regina Azimzadeh',
    title: 'CMO - Chief Marketing Officer',
    image: '/carousell/regina.JPG'
  }
];

export default function AboutPage({ setPage }: AboutPageProps) {
  // Duplicate the array to create seamless loop
  const duplicatedMembers = [...boardMembers, ...boardMembers];

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
            <span className="mr-3">🎯</span>
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To deliver quality gifts and create thoughtful experiences that keep sparks flying.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">✨</span>
            Our Vision
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To inspire meaningful moments that bring people together, and remind us to celebrate life's simple joys - just because.
          </p>
        </div>

        {/* Board Members Carousel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <span className="mr-3">👥</span>
            Our Leadership Team
          </h2>

          {/* Carousel Container */}
          <div className="relative h-80 overflow-hidden">
            <style>{`
              @keyframes scroll-left {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .carousel-track {
                animation: scroll-left 20s linear infinite;
              }
              .carousel-track:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="carousel-track flex gap-6 absolute left-0">
              {duplicatedMembers.map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  className="min-w-[280px] bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg p-6 flex flex-col items-center"
                >
                  <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-pink-300 shadow-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't load
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect width="160" height="160" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" fill="%23cbd5e0"%3E' + member.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-md font-semibold text-pink-600 text-center">
                    {member.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 italic">
            Hover over a card to pause the carousel
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
