import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddProduct from './pages/AddProduct';

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
        <nav style={{ padding: '15px 20px', backgroundColor: '#49ac7f', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
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
          
          <Link to="/" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <img 
              src="/svg/inventory.svg" 
              alt="Inventory" 
              style={{ width: '20px', height: '20px' }} 
            />
            Inventory
          </Link>
          <Link to="/add" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <img 
              src="/svg/add_packages.svg" 
              alt="Add Product" 
              style={{ width: '20px', height: '20px' }} 
            />
            Add Product
          </Link>
          <Link to="/calculator" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <img 
              src="/svg/calculator.svg.png" 
              alt="Calculator" 
              style={{ width: '20px', height: '20px' }} 
            />
            Calculator
          </Link>
        </nav>

  
      <Routes>
            <Route path="/add" element={<AddProduct />} />
            
          </Routes>

          </div>
    </Router>
        
);
  }
export default App;