import React from 'react';
import { motion } from 'framer-motion';

interface SurveyResponses {
  style: string;
  productTypes: string[];
  interests: string[];
  priceRange: string;
  occasion: string;
}

interface RecommendationsPageProps {
  surveyResponses: SurveyResponses;
  setPage: (pageName: string) => void;
  onSelectBox: (boxType: string) => void;
}

interface Recommendation {
  boxType: string;
  title: string;
  description: string;
  matchScore: number;
  reasons: string[];
  emoji: string;
  gradient: string;
}

export default function RecommendationsPage({ surveyResponses, setPage, onSelectBox }: RecommendationsPageProps) {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const { style, productTypes, interests, occasion } = surveyResponses;

    // Scoring system for each box type
    let forHerScore = 0;
    let forHimScore = 0;
    let buildABoxScore = 0;

    const forHerReasons: string[] = [];
    const forHimReasons: string[] = [];
    const buildABoxReasons: string[] = [];

    // Score based on product types
    if (productTypes.includes('beauty')) {
      forHerScore += 30;
      forHerReasons.push('Perfect for beauty & wellness enthusiasts');
    }
    if (productTypes.includes('food')) {
      forHerScore += 10;
      forHimScore += 20;
      buildABoxScore += 15;
      forHimReasons.push('Includes gourmet treats');
    }
    if (productTypes.includes('accessories')) {
      forHerScore += 20;
      forHimScore += 30;
      forHerReasons.push('Features elegant accessories');
      forHimReasons.push('Premium fashion accessories included');
    }
    if (productTypes.includes('tech')) {
      forHimScore += 25;
      forHimReasons.push('Tech gadgets for the modern man');
    }

    // Score based on style
    if (style === 'luxury') {
      forHerScore += 25;
      forHimScore += 20;
      forHerReasons.push('Luxurious premium items');
      forHimReasons.push('High-end selections');
    } else if (style === 'casual') {
      buildABoxScore += 30;
      buildABoxReasons.push('Customize for a relaxed, personal touch');
    } else if (style === 'elegant') {
      forHerScore += 20;
      forHimScore += 15;
      forHerReasons.push('Sophisticated and elegant items');
    }

    // Score based on interests
    if (interests.includes('wellness')) {
      forHerScore += 25;
      forHerReasons.push('Wellness & self-care focused');
    }
    if (interests.includes('fashion')) {
      forHerScore += 15;
      forHimScore += 10;
    }
    if (interests.includes('food')) {
      forHimScore += 20;
      buildABoxScore += 15;
    }

    // Score based on occasion
    if (occasion === 'justbecause') {
      buildABoxScore += 20;
      buildABoxReasons.push('Perfect for spontaneous, personalized gifting');
    }

    // Always give Build-A-Box a baseline
    buildABoxScore += 30;
    buildABoxReasons.push('Ultimate flexibility to create your perfect combination');

    // Ensure each box has reasons
    if (forHerReasons.length === 0) forHerReasons.push('Curated collection of thoughtful gifts');
    if (forHimReasons.length === 0) forHimReasons.push('Handpicked items for him');
    if (buildABoxReasons.length === 0) buildABoxReasons.push('Complete customization freedom');

    // Add limit to reasons (max 3)
    const limitReasons = (reasons: string[]) => reasons.slice(0, 3);

    // Create recommendation objects
    recommendations.push({
      boxType: 'for-her',
      title: 'For Her Box',
      description: 'A curated collection of elegant and thoughtful gifts perfect for the special woman in your life.',
      matchScore: Math.min(forHerScore, 100),
      reasons: limitReasons(forHerReasons),
      emoji: '💝',
      gradient: 'from-pink-400 to-purple-400'
    });

    recommendations.push({
      boxType: 'for-him',
      title: 'For Him Box',
      description: 'Handpicked items designed to surprise and delight the special man in your life.',
      matchScore: Math.min(forHimScore, 100),
      reasons: limitReasons(forHimReasons),
      emoji: '🎁',
      gradient: 'from-blue-400 to-indigo-400'
    });

    recommendations.push({
      boxType: 'build-a-box',
      title: 'Build-A-Box',
      description: 'Create your own unique gift box by selecting exactly what you want to include.',
      matchScore: Math.min(buildABoxScore, 100),
      reasons: limitReasons(buildABoxReasons),
      emoji: '🎨',
      gradient: 'from-purple-400 to-pink-400'
    });

    // Sort by match score (highest first)
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  };

  const recommendations = generateRecommendations();

  const handleSelectBox = (boxType: string) => {
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
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="text-6xl">✨</span>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Personalized Recommendations
          </h1>
          <p className="text-xl text-gray-700">
            Based on your preferences, here are the top 3 boxes perfect for you!
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.boxType}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative"
            >
              {/* Badge for top recommendation */}
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🏆 Best Match
                  </div>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => handleSelectBox(rec.boxType)}
                className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-4 ${
                  index === 0 ? 'border-yellow-400' : 'border-gray-200 hover:border-pink-400'
                } transition h-full flex flex-col`}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${rec.gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-5xl">{rec.emoji}</span>
                  </div>
                </div>

                {/* Match Score */}
                <div className="text-center mb-4">
                  <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    {rec.matchScore}% Match
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  {rec.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-center flex-grow">
                  {rec.description}
                </p>

                {/* Reasons */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Why this box:</p>
                  <ul className="space-y-2">
                    {rec.reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectBox(rec.boxType);
                  }}
                  className={`w-full bg-gradient-to-r ${rec.gradient} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition`}
                >
                  Customize This Box
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Want to explore all options?
          </h3>
          <p className="text-gray-600 mb-6">
            View all our boxes and create your perfect gift.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('home')}
            className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Browse All Boxes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
