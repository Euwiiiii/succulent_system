import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SmartCalculator from './pages/SmartCalculator';
import Supplies from './pages/Supplies';
import Products from './pages/Products';
import Sales from './pages/Sales';

function App() {
  return (
    <Router>
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
          <h2 style={{color: 'white', 
              margin: 0,             
              marginRight: 'auto',   
              fontWeight: 'bold', 
              display: 'flex',        
              alignItems: 'center', 
              gap: '10px' }}>
              <img 
              src="/svg/succulent.svg" 
              alt="Inventory" 
              style={{ width: '20px', height: '20px' }} 
            /> Succulent System
            </h2>
          
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/svg/inventory.svg" alt="Inventory" style={{ width: '20px', height: '20px' }} />
            Inventory
          </Link>
          <Link to="/calculator" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/svg/calculator.svg.png" alt="Smart Calculator" style={{ width: '20px', height: '20px' }} />
            Smart Calculator
          </Link>
          <Link to="/supplies" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Supplies
          </Link>
          <Link to="/sales" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Sales Tracker
          </Link>
        </nav>

  
      <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/calculator" element={<SmartCalculator />} /> 
            <Route path="/supplies" element={<Supplies />} />
            <Route path="/sales" element={<Sales />} />
          </Routes>

          </div>
    </Router>
        
);
  }
export default App;