import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SurveyResponses {
  style: string;
  productTypes: string[];
  interests: string[];
  priceRange: string;
  occasion: string;
}

interface SurveyPageProps {
  handleSurveySubmit: (responses: SurveyResponses) => void;
  setPage: (pageName: string) => void;
}

interface Question {
  id: keyof SurveyResponses;
  question: string;
  type: 'radio' | 'checkbox';
  options: { value: string; label: string }[];
}

const surveyQuestions: Question[] = [
  {
    id: 'style',
    question: "What's your preferred style?",
    type: 'radio',
    options: [
      { value: 'luxury', label: 'Luxury & Premium' },
      { value: 'casual', label: 'Casual & Comfortable' },
      { value: 'elegant', label: 'Elegant & Sophisticated' },
      { value: 'modern', label: 'Modern & Trendy' },
      { value: 'classic', label: 'Classic & Timeless' },
    ],
  },
  {
    id: 'productTypes',
    question: "What types of products do you prefer? (Select all that apply)",
    type: 'checkbox',
    options: [
      { value: 'beauty', label: 'Beauty & Wellness' },
      { value: 'food', label: 'Gourmet Food & Beverages' },
      { value: 'accessories', label: 'Fashion Accessories' },
      { value: 'home', label: 'Home Decor' },
      { value: 'tech', label: 'Tech Gadgets' },
    ],
  },
  {
    id: 'interests',
    question: "What are your main interests? (Select all that apply)",
    type: 'checkbox',
    options: [
      { value: 'wellness', label: 'Health & Wellness' },
      { value: 'fashion', label: 'Fashion & Style' },
      { value: 'tech', label: 'Technology' },
      { value: 'food', label: 'Food & Cooking' },
      { value: 'art', label: 'Art & Creativity' },
    ],
  },
  {
    id: 'priceRange',
    question: "What's your preferred price range?",
    type: 'radio',
    options: [
      { value: 'budget', label: '$20-$50' },
      { value: 'moderate', label: '$50-$100' },
      { value: 'premium', label: '$100-$200' },
      { value: 'luxury', label: '$200+' },
    ],
  },
  {
    id: 'occasion',
    question: "What occasion is this gift for?",
    type: 'radio',
    options: [
      { value: 'birthday', label: 'Birthday' },
      { value: 'anniversary', label: 'Anniversary' },
      { value: 'justbecause', label: 'Just Because' },
      { value: 'holiday', label: 'Holiday' },
      { value: 'thankyou', label: 'Thank You' },
    ],
  },
];

export default function SurveyPage({ handleSurveySubmit, setPage }: SurveyPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Partial<SurveyResponses>>({
    productTypes: [],
    interests: [],
  });

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;

  const handleRadioChange = (questionId: keyof SurveyResponses, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleCheckboxChange = (questionId: keyof SurveyResponses, value: string) => {
    const currentValues = (responses[questionId] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setResponses({ ...responses, [questionId]: newValues });
  };

  const handleNext = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const answer = responses[currentQuestion.id];
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const handleSubmit = () => {
    if (!isCurrentQuestionAnswered()) return;

    const completeResponses: SurveyResponses = {
      style: responses.style || '',
      productTypes: responses.productTypes || [],
      interests: responses.interests || [],
      priceRange: responses.priceRange || '',
      occasion: responses.occasion || '',
    };

    handleSurveySubmit(completeResponses);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen p-8"
    >
      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setPage('home')}
            className="text-gray-600 hover:text-gray-800 font-semibold transition"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-center text-gray-800 flex-1">Preference Survey</h2>
          <div className="w-16"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {surveyQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / surveyQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / surveyQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xl font-semibold mb-6">{currentQuestion.question}</p>

          {currentQuestion.type === 'radio' && (
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    responses[currentQuestion.id] === option.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={responses[currentQuestion.id] === option.value}
                    onChange={() => handleRadioChange(currentQuestion.id, option.value)}
                    className="form-radio text-pink-500 w-5 h-5"
                  />
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const currentValues = (responses[currentQuestion.id] as string[]) || [];
                const isChecked = currentValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      isChecked
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(currentQuestion.id, option.value)}
                      className="form-checkbox text-pink-500 w-5 h-5 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered()}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Complete Survey
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
