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
  email: string;
  surveyResponses?: SurveyResponses;
  orderHistory: Order[];
  createdAt: string;
}

interface SurveyResponses {
  style: string;
  productTypes: string[];
  interests: string[];
  priceRange: string;
  occasion: string;
}

interface Order {
  orderId: string;
  timestamp: string;
  boxes: CustomBox[];
  totalAmount: number;
  tax: number;
  grandTotal: number;
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

  // Check for admin token in URL on mount and load user session
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('admin');
    if (token) {
      setAdminToken(token);
      setPage('admin');
    }

    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const handleLogin = (username: string, password: string): boolean => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username] && users[username].password === password) {
      const userData = users[username];
      setUser({
        username: userData.username,
        email: userData.email,
        surveyResponses: userData.surveyResponses,
        orderHistory: userData.orderHistory || [],
        createdAt: userData.createdAt
      });
      setPage('home');
      return true;
    }
    return false;
  };

  const handleSignup = (username: string, email: string, password: string): boolean => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Check if username already exists
    if (users[username]) {
      return false;
    }

    // Create new user
    const newUser: User = {
      username,
      email,
      orderHistory: [],
      createdAt: new Date().toISOString()
    };

    users[username] = {
      ...newUser,
      password
    };

    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    setPage('survey'); // Redirect to survey after signup
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  const handleSurveySubmit = (surveyResponses: SurveyResponses) => {
    if (!user) return;

    // Update user with survey responses
    const updatedUser = {
      ...user,
      surveyResponses
    };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user.username]) {
      users[user.username] = {
        ...users[user.username],
        surveyResponses
      };
      localStorage.setItem('users', JSON.stringify(users));
    }

    setPage('home');
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

  const handleCheckout = (order: Order) => {
    if (!user) return;

    // Update user with new order
    const updatedUser = {
      ...user,
      orderHistory: [...user.orderHistory, order]
    };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user.username]) {
      users[user.username] = {
        ...users[user.username],
        orderHistory: updatedUser.orderHistory
      };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <>
      {page !== 'home' && page !== 'customize' && page !== 'cart' && page !== 'admin' && page !== 'profile' && <BackgroundSlideshow images={slideshowImages} />}
      {(() => {
        switch (page) {
          case 'welcome':
            return <WelcomePage setPage={setPage} />;
          case 'login':
            return <LoginPage handleLogin={handleLogin} handleSignup={handleSignup} />;
          case 'home':
            return <HomePage setPage={setPage} onSelectBox={handleSelectBox} cartCount={cart.length} user={user} onLogout={handleLogout} />;
          case 'customize':
            return <BoxCustomizationPage boxType={selectedBoxType} setPage={setPage} onAddToCart={handleAddToCart} userSurvey={user?.surveyResponses} />;
          case 'cart':
            return <CartPage cart={cart} setPage={setPage} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} onCheckout={handleCheckout} />;
          case 'survey':
            return <SurveyPage handleSurveySubmit={handleSurveySubmit} setPage={setPage} />;
          case 'admin':
            return <AdminPage setPage={setPage} adminToken={adminToken} />;
          default:
            return <WelcomePage setPage={setPage} />;
        }
      })()}
    </>
  );
}