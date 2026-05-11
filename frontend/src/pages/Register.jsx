import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = ({ onClose, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await registerUser({ username, password, role });
            login(data.user);
            alert('Registration successful!');
            if (onClose) onClose();
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={overlayStyle} onClick={onClose}></div>
            <div style={{...cardStyle, zIndex: 10}}>
                <button onClick={onClose} style={closeBtnStyle}>✕</button>
                <h2 style={{ color: '#105666', textAlign: 'center', marginBottom: '30px', fontSize: '24px', marginTop: 0 }}>Create Account</h2>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0A3323', display: 'flex' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            style={{...inputStyle, paddingLeft: '40px'}}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0A3323', display: 'flex' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            style={{...inputStyle, paddingLeft: '40px', paddingRight: '40px'}}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#0A3323', display: 'flex', padding: 0 }}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0A3323', display: 'flex' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </span>
                        <select 
                            value={role} 
                            onChange={e => setRole(e.target.value)} 
                            style={{...inputStyle, paddingLeft: '40px', appearance: 'none'}}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Admin">Admin (Seller)</option>
                        </select>
                    </div>
                    
                    <button type="submit" style={btnStyle}>Register</button>
                </form>
                
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                        <span style={{ padding: '0 10px', color: '#666', fontSize: '14px' }}>Already have an account?</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                    </div>
                    <button 
                        onClick={onSwitchToLogin}
                        style={{ 
                            ...btnStyle, 
                            background: 'transparent', 
                            border: '2px solid #0A3323', 
                            color: '#0A3323' 
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

const containerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    zIndex: 9999
};

const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1,
    backdropFilter: 'blur(3px)'
};

const cardStyle = { 
    padding: '40px', 
    backgroundImage: 'url("/pictures/bg-loginpage.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '16px', 
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)', 
    width: '400px',
    boxSizing: 'border-box',
    position: 'relative'
};

const closeBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#0A3323',
    padding: '5px'
};

const inputStyle = { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '2px solid #0A3323', 
    backgroundColor: '#F7F4D5',
    width: '100%',
    boxSizing: 'border-box',
    color: '#0A3323',
    fontSize: '15px'
};

const btnStyle = { 
    padding: '14px', 
    background: '#0A3323', 
    color: '#F7F4D5', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    width: '100%',
    fontSize: '16px',
    transition: 'opacity 0.2s'
};

export default Register;
