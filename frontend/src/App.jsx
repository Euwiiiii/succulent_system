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
      <div style={{ backgroundColor: '#0A3323', color: '#F7F4D5', display: 'flex', flexDirection: 'column' }}>
        {/* Row 1: Branding */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(247, 244, 213, 0.2)', display: 'flex', alignItems: 'center' }}>
          <h2 style={{color: '#F7F4D5', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/svg/succulent.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} /> 
            Succulent System
          </h2>
        </div>

        {/* Row 2: Sub-Header Controls */}
        <div style={{ padding: '10px 20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={navLinkStyle}>
            <img src="/svg/inventory.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} />
            Inventory
          </Link>

          {/* Search Bar in Sub-Header */}
          <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ 
                  padding: '8px 12px', 
                  borderRadius: '20px', 
                  backgroundColor: '#F7F4D5', 
                  color: '#0A3323', 
                  border: 'none', 
                  width: '250px',
                  outline: 'none'
              }}
          />
          
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

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 'bold' }}>Hi, {user.username} ({user.role})</span>
                <button onClick={logout} style={{ background: 'transparent', color: '#F7F4D5', border: '1px solid #F7F4D5', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={navLinkStyle}>Login</Link>
                <Link to="/register" style={{ ...navLinkStyle, border: '1px solid #F7F4D5', padding: '5px 10px', borderRadius: '5px' }}>Register</Link>
              </>
            )}
            {/* Cart Icon */}
            <Link to="/" style={navLinkStyle}>
              <span style={{ fontSize: '1.2rem' }}>🛒</span> Cart
            </Link>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Products searchTerm={searchTerm} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (Fallback to home if not admin) */}
        <Route path="/calculator" element={user?.role === 'Admin' ? <SmartCalculator /> : <Products searchTerm={searchTerm} />} /> 
        <Route path="/supplies" element={user?.role === 'Admin' ? <Supplies /> : <Products searchTerm={searchTerm} />} />
        <Route path="/sales" element={user?.role === 'Admin' ? <Sales /> : <Products searchTerm={searchTerm} />} />
        <Route path="/dashboard" element={user?.role === 'Admin' ? <Dashboard /> : <Products searchTerm={searchTerm} />} />
      </Routes>
      {user?.role === 'Customer' && <CustomerChatbox />}
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