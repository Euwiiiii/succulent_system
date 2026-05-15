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
      <nav style={{ padding: '15px 20px', backgroundColor: 'var(--dark-green)', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, marginRight: 'auto', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/svg/succulent.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} />
          Succulent System
        </h2>


        <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" title="Inventory" style={navLinkStyle}>
            <div className="inventory-icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.4399 7.75H3.56006M14.5 11.5C12.4253 11.5 9.5 11.5 9.5 11.5M20.5 8.25164V18.375C20.5 19.5486 19.5486 20.5 18.375 20.5H5.625C4.4514 20.5 3.5 19.5486 3.5 18.375V8.25164C3.5 7.92175 3.57681 7.59638 3.72434 7.30132L5.1845 4.381C5.45447 3.84107 6.00632 3.5 6.60999 3.5H17.39C17.9937 3.5 18.5455 3.84107 18.8155 4.381L20.2757 7.30132C20.4232 7.59638 20.5 7.92175 20.5 8.25164Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>

          {user?.role === 'Admin' && (
            <>
              <Link to="/dashboard" title="Dashboard" style={navLinkStyle}>
                <div className="icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 10.5V6C19 4.89543 18.1046 4 17 4H5C3.89543 4 3 4.89543 3 6V13.8261C3 14.9307 3.89543 15.8261 5 15.8261H6.56522V20L10.7391 15.8261H11M16.163 18.3913L18.7717 21V18.3913H19C20.1046 18.3913 21 17.4959 21 16.3913V13C21 11.8954 20.1046 11 19 11H13C11.8954 11 11 11.8954 11 13V16.3913C11 17.4959 11.8954 18.3913 13 18.3913H16.163Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
              <Link to="/sales" title="Sales Tracker" style={navLinkStyle}>
                <div className="icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.1999 16.8V14.4M11.9999 16.8V12M16.7999 16.8V7.20002M4.7999 21.6C3.47442 21.6 2.3999 20.5255 2.3999 19.2V4.80002C2.3999 3.47454 3.47442 2.40002 4.7999 2.40002H19.1999C20.5254 2.40002 21.5999 3.47454 21.5999 4.80002V19.2C21.5999 20.5255 20.5254 21.6 19.1999 21.6H4.7999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
              <Link to="/supplies" title="Supplies" style={navLinkStyle}>
                <div className="icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
              <Link to="/calculator" title="Smart Calculator" style={navLinkStyle}>
                <div className="icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.375 17.625L17.625 6.375M8.25 10.75V8.25M8.25 8.25V5.75M8.25 8.25H5.75M8.25 8.25H10.75M13.25 16.375H18.25M4.7027 22H19.2973C20.79 22 22 20.79 22 19.2973V4.7027C22 3.21004 20.79 2 19.2973 2H4.7027C3.21004 2 2 3.21004 2 4.7027V19.2973C2 20.79 3.21004 22 4.7027 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
            </>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
              <span style={{ fontWeight: 'bold' }}>Hi, {user.username}</span>
              <button onClick={logout} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }} title="Logout">
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 20.2L1.0004 16.5996C1.00063 14.6115 2.61234 13 4.6004 13H10.6M17.6286 16.9L20.2 14.5L17.6286 12.1M20.2 14.5H13.6M13 4.6C13 6.58822 11.3882 8.2 9.4 8.2C7.41177 8.2 5.8 6.58822 5.8 4.6C5.8 2.61177 7.41177 1 9.4 1C11.3882 1 13 2.61177 13 4.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
              <Link to="/login" title="Login" style={navLinkStyle}>
                <div className="profile-icon-wrapper" style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.5557C14.3722 13.5557 16.4711 14.0084 17.9395 14.6973C19.4872 15.4234 20 16.2289 20 16.7783C19.9998 17.4746 19.6205 18.2354 18.3896 18.877C17.1255 19.5358 15.0584 20 12 20C8.94161 20 6.87454 19.5358 5.61035 18.877C4.37952 18.2354 4.00016 17.4746 4 16.7783C4 16.2289 4.51284 15.4234 6.06055 14.6973C7.52885 14.0084 9.62782 13.5557 12 13.5557ZM12 4C13.484 4 14.8184 5.4463 14.8184 7.00977C14.8183 8.52535 13.5293 9.875 12 9.875C10.4707 9.875 9.1817 8.52535 9.18164 7.00977C9.18164 5.4463 10.516 4 12 4Z"
                      stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </Link>
            </div>
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