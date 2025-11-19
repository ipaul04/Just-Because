import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  handleLogin: (username: string, password: string) => boolean;
  handleSignup: (username: string, email: string, password: string) => boolean;
}

export default function LoginPage({ handleLogin, handleSignup }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (isSignup) {
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const success = handleSignup(username, email, password);
      if (!success) {
        setError('Username already exists');
      }
    } else {
      const success = handleLogin(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen p-8"
    >
      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Just Because</h1>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
            required
          />

          {isSignup && (
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
              required
            />
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
            required
          />

          {isSignup && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
              required
            />
          )}

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition font-semibold"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
