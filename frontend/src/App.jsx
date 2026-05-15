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
          <Link to="/" style={navLinkStyle}>
            <div className="inventory-icon-wrapper" style={{ width: 24, height: 24, flex: 'none', order: 0, flexGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.4399 7.75H3.56006M14.5 11.5C12.4253 11.5 9.5 11.5 9.5 11.5M20.5 8.25164V18.375C20.5 19.5486 19.5486 20.5 18.375 20.5H5.625C4.4514 20.5 3.5 19.5486 3.5 18.375V8.25164C3.5 7.92175 3.57681 7.59638 3.72434 7.30132L5.1845 4.381C5.45447 3.84107 6.00632 3.5 6.60999 3.5H17.39C17.9937 3.5 18.5455 3.84107 18.8155 4.381L20.2757 7.30132C20.4232 7.59638 20.5 7.92175 20.5 8.25164Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
          {user ? (
            <>
              <span style={{ fontWeight: 'bold' }}>Hi, {user.username} ({user.role})</span>
              <button onClick={logout} style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>
                <div className="profile-icon-wrapper" style={{ width: 24, height: 24, flex: 'none', order: 0, flexGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.5557C14.3722 13.5557 16.4711 14.0084 17.9395 14.6973C19.4872 15.4234 20 16.2289 20 16.7783C19.9998 17.4746 19.6205 18.2354 18.3896 18.877C17.1255 19.5358 15.0584 20 12 20C8.94161 20 6.87454 19.5358 5.61035 18.877C4.37952 18.2354 4.00016 17.4746 4 16.7783C4 16.2289 4.51284 15.4234 6.06055 14.6973C7.52885 14.0084 9.62782 13.5557 12 13.5557ZM12 4C13.484 4 14.8184 5.4463 14.8184 7.00977C14.8183 8.52535 13.5293 9.875 12 9.875C10.4707 9.875 9.1817 8.52535 9.18164 7.00977C9.18164 5.4463 10.516 4 12 4Z" 
                      stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </Link>
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
const iconStyle = { width: '24px', height: '24px', flex: 'none', order: 0, flexGrow: 0 };

export default App;