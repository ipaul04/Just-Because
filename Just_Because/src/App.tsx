import React, { useState } from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SurveyPage from './SurveyPage';
import WelcomePage from './WelcomePage';
import BoxCustomizationPage from './BoxCustomizationPage';
import CartPage from './CartPage';
import AdminPage from './AdminPage';
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

interface BoxItem {
  id: number;
  name: string;
  price: number;
  included: boolean;
}

interface CustomBox {
  id: number;
  type: string;
  items: BoxItem[];
  totalPrice: number;
}

// Generate colorful placeholder images using data URLs
const generatePlaceholderImage = (color1: string, color2: string, text: string) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="grad${text}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad${text})"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.9">${text}</text>
    </svg>
  `)}`;
};

const slideshowImages = [
  generatePlaceholderImage('#ff69b4', '#ff1493', '💝'),
  generatePlaceholderImage('#ffd700', '#ff69b4', '⭐'),
  generatePlaceholderImage('#ff69b4', '#ffb6c1', '🌸'),
  generatePlaceholderImage('#dc143c', '#ff69b4', '🌹'),
  generatePlaceholderImage('#4169e1', '#87ceeb', '🎁'),
  generatePlaceholderImage('#da70d6', '#9370db', '🦋'),
  generatePlaceholderImage('#ff6347', '#ff8c00', '🎈'),
  generatePlaceholderImage('#ff1493', '#ffb6c1', '🎀'),
  generatePlaceholderImage('#ffc0cb', '#fff0f5', '🧁'),
  generatePlaceholderImage('#ff69b4', '#4169e1', '🎉'),
];

export default function App() {
  const [page, setPage] = useState('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyEntry[]>([]);
  const [cart, setCart] = useState<CustomBox[]>([]);
  const [selectedBoxType, setSelectedBoxType] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  // Check for admin token in URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('admin');
    if (token) {
      setAdminToken(token);
      setPage('admin');
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (username && password) {
      setUser({ username });
      setPage('home');
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

  const handleSelectBox = (boxType: string) => {
    setSelectedBoxType(boxType);
  };

  const handleAddToCart = (box: CustomBox) => {
    setCart((prevCart) => [...prevCart, box]);
    console.log('Added to cart:', box.type, 'with', box.items.length, 'items');
  };

  const handleRemoveFromCart = (boxId: number) => {
    setCart((prevCart) => prevCart.filter(box => box.id !== boxId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <>
      {page !== 'home' && page !== 'customize' && page !== 'cart' && page !== 'admin' && <BackgroundSlideshow images={slideshowImages} />}
      {(() => {
        switch (page) {
          case 'welcome':
            return <WelcomePage setPage={setPage} />;
          case 'login':
            return <LoginPage handleLogin={handleLogin} />;
          case 'home':
            return <HomePage setPage={setPage} onSelectBox={handleSelectBox} cartCount={cart.length} />;
          case 'customize':
            return <BoxCustomizationPage boxType={selectedBoxType} setPage={setPage} onAddToCart={handleAddToCart} />;
          case 'cart':
            return <CartPage cart={cart} setPage={setPage} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />;
          case 'survey':
            return <SurveyPage handleSurveySubmit={handleSurveySubmit} surveyData={surveyData} setPage={setPage} />;
          case 'admin':
            return <AdminPage setPage={setPage} adminToken={adminToken} />;
          default:
            return <WelcomePage setPage={setPage} />;
        }
      })()}
    </>
  );
}