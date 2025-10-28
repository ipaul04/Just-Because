import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BackgroundSlideshow from './BackgroundSlideshow';

interface SurveyEntry {
  id: number;
  feeling: string;
  smile: string;
  message?: string;
}

interface SurveyPageProps {
  handleSurveySubmit: (e: React.FormEvent<HTMLFormElement>, setNotification: (message: string) => void) => void;
  surveyData: SurveyEntry[];
  setPage: (pageName: string) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'radio' | 'text';
  options?: { value: string; label: string }[];
}

const surveyQuestions: Question[] = [
  {
    id: 'feeling',
    question: 'How are you feeling today?',
    type: 'radio',
    options: [
      { value: 'Happy', label: 'Happy' },
      { value: 'Inspired', label: 'Inspired' },
      { value: 'Neutral', label: 'Neutral' },
      { value: 'Tired', label: 'Tired' },
      { value: 'Anxious', label: 'Anxious' },
    ],
  },
  {
    id: 'smile',
    question: 'What\'s one thing that made you smile?',
    type: 'radio',
    options: [
      { value: 'A good joke', label: 'A good joke' },
      { value: 'Time with loved ones', label: 'Time with loved ones' },
      { value: 'Achieving a goal', label: 'Achieving a goal' },
      { value: 'Nature\'s beauty', label: 'Nature\'s beauty' },
      { value: 'Something unexpected', label: 'Something unexpected' },
    ],
  },
  {
    id: 'message',
    question: 'Anything you\'d like to share?',
    type: 'text',
  },
];

const slideshowImages = [
  '/slideshow/image1.png', // Placeholder - User should replace with actual images in public/slideshow
  '/slideshow/image2.png', // Placeholder
  '/slideshow/image3.png', // Placeholder
];

export default function SurveyPage({ handleSurveySubmit, surveyData, setPage }: SurveyPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState('');

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResponses({ ...responses, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await saveSurveyResponseToDatabase(responses);
      handleSurveySubmit(e, setNotification);
      setPage('home'); // Navigate to home page after survey submission
    } catch (error) {
      console.error('Failed to submit survey:', error);
      setNotification('Failed to submit survey. Please try again.');
    }
  };

  const saveSurveyResponseToDatabase = async (data: Record<string, string>) => {
    const response = await fetch('/api/survey',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen p-8"
    >
      <BackgroundSlideshow images={slideshowImages} />
      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Quick Survey</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="mb-4">
            <p className="text-xl font-semibold mb-4">{currentQuestion.question}</p>
            {currentQuestion.type === 'radio' && currentQuestion.options && (
              <div className="flex flex-wrap gap-4">
                {currentQuestion.options.map((option) => (
                  <label key={option.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.value}
                      checked={responses[currentQuestion.id] === option.value}
                      onChange={handleAnswerChange}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
            {currentQuestion.type === 'text' && (
              <textarea
                name={currentQuestion.id}
                value={responses[currentQuestion.id] || ''}
                onChange={handleAnswerChange}
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              ></textarea>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            {isLastQuestion ? (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Submit Survey
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </form>
        {notification && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {notification}
          </div>
        )}
      </div>
    </motion.div>
  );
}