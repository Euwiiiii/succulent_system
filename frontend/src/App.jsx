import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SmartCalculator from './pages/SmartCalculator';
import Supplies from './pages/Supplies';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState } from 'react';
import CustomerChatbox from './components/CustomerChatbox';

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div>
      <div style={{ 
        height: '110px',
        backgroundImage: 'url("/pictures/bg-frontpage.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      </div>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#0A3323', color: '#F7F4D5', display: 'flex', flexDirection: 'column', padding: '15px 20px', fontFamily: 'sans-serif' }}>
        
        {/* Row 1: Title & Inventory Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ color: '#F7F4D5', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/svg/succulent.svg" alt="Logo" style={{ width: '20px', height: '20px' }} /> 
            Succulent System
          </h2>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={navLinkStyle}>
              <img src="/svg/inventory.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} />
              Inventory
            </Link>
            
            {user?.role === 'Admin' && (
              <>
                <Link to="/calculator" style={navLinkStyle}>
                  <img src="/svg/calculator.svg.png" alt="Smart Calculator" style={{ width: '20px', height: '20px' }} />
                  Smart Calculator
                </Link>
                <Link to="/supplies" style={navLinkStyle}>Supplies</Link>
                <Link to="/sales" style={navLinkStyle}>Sales Tracker</Link>
                <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Search Bar, Login, Cart */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          {/* Search Bar */}
          <div style={{ flex: '1', display: 'flex', minWidth: '250px' }}>
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ 
                padding: '10px 20px', 
                borderRadius: '30px', 
                backgroundColor: '#F7F4D5', 
                color: '#0A3323', 
                border: 'none', 
                width: '100%',
                maxWidth: '400px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Right Side: Login & Cart */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 'bold', color: '#F7F4D5' }}>Hi, {user.username} ({user.role})</span>
                <button onClick={logout} style={{ background: 'transparent', color: '#F7F4D5', border: '1px solid #F7F4D5', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <div onClick={openLogin} style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Login
              </div>
            )}
            
            <Link to="/" style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="#F7F4D5"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="#F7F4D5"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cart
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Products searchTerm={searchTerm} />} />
        {/* Protected Routes (Fallback to home if not admin) */}
        <Route path="/calculator" element={user?.role === 'Admin' ? <SmartCalculator /> : <Products searchTerm={searchTerm} />} /> 
        <Route path="/supplies" element={user?.role === 'Admin' ? <Supplies /> : <Products searchTerm={searchTerm} />} />
        <Route path="/sales" element={user?.role === 'Admin' ? <Sales /> : <Products searchTerm={searchTerm} />} />
        <Route path="/dashboard" element={user?.role === 'Admin' ? <Dashboard /> : <Products searchTerm={searchTerm} />} />
      </Routes>

      {user?.role === 'Customer' && <CustomerChatbox />}

      {/* Modals */}
      {isLoginModalOpen && !user && (
        <Login onClose={closeModals} onSwitchToRegister={openRegister} />
      )}
      {isRegisterModalOpen && !user && (
        <Register onClose={closeModals} onSwitchToLogin={openLogin} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const navLinkStyle = { color: '#F7F4D5', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };

export default App;