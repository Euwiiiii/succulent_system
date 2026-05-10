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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '80px', 
        backgroundColor: '#0A3323', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px 0', 
        gap: '30px' 
      }}>
        <div style={{ padding: '10px', backgroundColor: '#105666', borderRadius: '50%', marginBottom: '20px' }}>
            <img src="/svg/succulent.svg" alt="Logo" style={{ width: '30px', height: '30px', filter: 'invert(98%) sepia(21%) saturate(237%) hue-rotate(338deg) brightness(101%) contrast(97%)' }} /> 
        </div>
        
        <Link to="/" style={navIconStyle} title="Inventory">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </Link>
        
        {user?.role === 'Admin' && (
          <>
            <Link to="/calculator" style={navIconStyle} title="Smart Calculator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="16" y1="18" x2="16" y2="18.01"></line><line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="8" y1="18" x2="8" y2="18.01"></line><line x1="16" y1="10" x2="16" y2="10.01"></line><line x1="12" y1="10" x2="12" y2="10.01"></line><line x1="8" y1="10" x2="8" y2="10.01"></line></svg>
            </Link>
            <Link to="/supplies" style={navIconStyle} title="Supplies">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </Link>
            <Link to="/sales" style={navIconStyle} title="Sales Tracker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </Link>
            <Link to="/dashboard" style={navIconStyle} title="Dashboard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F4D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </Link>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ 
          padding: '15px 30px', 
          backgroundColor: 'white', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#105666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span style={{ fontWeight: 'bold', color: '#105666' }}>{user.username} {user.role === 'Admin' ? '(Admin)' : ''}</span>
                </div>
                <button onClick={logout} style={{ background: '#D3968C', color: '#F7F4D5', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#105666', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ background: '#D3968C', color: '#F7F4D5', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>Register</Link>
              </>
            )}
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
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
        </div>
      </main>
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

const navIconStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  width: '50px', 
  height: '50px', 
  borderRadius: '12px',
  transition: 'background-color 0.2s',
  textDecoration: 'none'
};

// Add global styles for hover effects
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  aside a:hover { background-color: #839958; }
`;
document.head.appendChild(styleSheet);

export default App;