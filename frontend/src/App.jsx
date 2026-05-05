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
import { useContext } from 'react';
import CustomerChatbox from './components/CustomerChatbox';

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);

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
      <nav style={{ padding: '15px 20px', backgroundColor: '#2d6a4f', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h2 style={{color: 'white', margin: 0, marginRight: 'auto', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/svg/succulent.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} /> 
          Succulent System
        </h2>
        
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

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontWeight: 'bold' }}>Hi, {user.username} ({user.role})</span>
              <button onClick={logout} style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={{ ...navLinkStyle, border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (Fallback to home if not admin) */}
        <Route path="/calculator" element={user?.role === 'Admin' ? <SmartCalculator /> : <Products />} /> 
        <Route path="/supplies" element={user?.role === 'Admin' ? <Supplies /> : <Products />} />
        <Route path="/sales" element={user?.role === 'Admin' ? <Sales /> : <Products />} />
        <Route path="/dashboard" element={user?.role === 'Admin' ? <Dashboard /> : <Products />} />
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

const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };

export default App;