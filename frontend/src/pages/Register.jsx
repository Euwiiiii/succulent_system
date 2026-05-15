import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await registerUser({ username, password, role });
            login(data.user);
            alert('Registration successful!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: 'var(--dark-green)', textAlign: 'center' }}>Register</h2>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        style={inputStyle}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        style={inputStyle}
                        required
                    />
                    <select 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                        style={inputStyle}
                    >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin (Seller)</option>
                    </select>
                    <button type="submit" style={btnStyle}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--midnight-green)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' };
const cardStyle = { padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '350px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { padding: '12px', background: 'var(--midnight-green)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Register;
