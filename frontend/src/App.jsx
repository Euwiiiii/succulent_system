import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SmartCalculator from './pages/SmartCalculator';
import Supplies from './pages/Supplies';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import CustomerChatbox from './components/CustomerChatbox';

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const location = useLocation();

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

  const getNavStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
    backgroundColor: location.pathname === path ? '#839958' : 'transparent',
    color: '#F7F4D5'
  });

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

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={getNavStyle('/')} title="Inventory">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </Link>

            {user?.role === 'Admin' && (
              <>
                <Link to="/calculator" style={getNavStyle('/calculator')} title="Smart Calculator">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                    <line x1="8" y1="6" x2="16" y2="6"/>
                    <line x1="16" y1="14" x2="16" y2="14.01"/>
                    <line x1="12" y1="14" x2="12" y2="14.01"/>
                    <line x1="8" y1="14" x2="8" y2="14.01"/>
                    <line x1="16" y1="18" x2="16" y2="18.01"/>
                    <line x1="12" y1="18" x2="12" y2="18.01"/>
                    <line x1="8" y1="18" x2="8" y2="18.01"/>
                    <line x1="16" y1="10" x2="16" y2="10.01"/>
                    <line x1="12" y1="10" x2="12" y2="10.01"/>
                    <line x1="8" y1="10" x2="8" y2="10.01"/>
                  </svg>
                </Link>
                <Link to="/supplies" style={getNavStyle('/supplies')} title="Supplies">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </Link>
                <Link to="/sales" style={getNavStyle('/sales')} title="Sales Tracker">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 21V3h5a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5H7" />
                    <path d="M7 7h10" />
                    <path d="M7 11h10" />
                  </svg>
                </Link>
                <Link to="/dashboard" style={getNavStyle('/dashboard')} title="Dashboard">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"/>
                    <rect x="14" y="3" width="7" height="5"/>
                    <rect x="14" y="12" width="7" height="9"/>
                    <rect x="3" y="16" width="7" height="5"/>
                  </svg>
                </Link>
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
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Login
              </div>
            )}

            {user?.role !== 'Admin' && (
              <Link to="/" style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="#F7F4D5" />
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="#F7F4D5" />
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cart
              </Link>
            )}
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