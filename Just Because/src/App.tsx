import React, { useState } from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SurveyPage from './SurveyPage';
import WelcomePage from './WelcomePage';
import BackgroundSlideshow from './BackgroundSlideshow';

interface User {
  username: string;
}

interface SurveyEntry {
  id: number;
  feeling: string;
  smile: string;
  message?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface LoginPageProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface HomePageProps {
  user: User | null;
  setPage: (pageName: string) => void;
  handleLogout: () => void;
  onAddToCart: (product: Product) => void;
}

interface SurveyPageProps {
  handleSurveySubmit: (e: React.FormEvent<HTMLFormElement>, setNotification: (message: string) => void) => void;
  surveyData: SurveyEntry[];
  setPage: (pageName: string) => void;
}

const slideshowImages = [
  '/slideshow/initial.png',
  '/slideshow/image1.png',
  '/slideshow/image2.png',
  '/slideshow/image3.png',
];

export default function App() {
  const [page, setPage] = useState('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyEntry[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (username && password) {
      setUser({ username });
      setPage('survey'); // Changed from 'home' to 'survey'
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  const handleSurveySubmit = (e: React.FormEvent<HTMLFormElement>, setNotification: (message: string) => void) => {
    const form = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(form.entries()) as Omit<SurveyEntry, 'id'>;
    const newEntry: SurveyEntry = { ...data, id: Date.now() }; // Add unique ID
    setSurveyData((prev) => [...prev, newEntry]);
    setNotification('Thank you for submitting the survey!');
    setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    setPage('home'); // Navigate to home page after survey submission
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    console.log('Added to cart:', product.name);
  };

  return (
    <>
      <BackgroundSlideshow images={slideshowImages} />
      {(() => {
        switch (page) {
          case 'welcome':
            return <WelcomePage setPage={setPage} />;
          case 'login':
            return <LoginPage handleLogin={handleLogin} />;
          case 'home':
            return <HomePage user={user} setPage={setPage} handleLogout={handleLogout} onAddToCart={handleAddToCart} />;
          case 'survey':
            return <SurveyPage handleSurveySubmit={handleSurveySubmit} surveyData={surveyData} setPage={setPage} />;
          default:
            return <LoginPage handleLogin={handleLogin} />;
        }
      })()}
    </>
  );
}