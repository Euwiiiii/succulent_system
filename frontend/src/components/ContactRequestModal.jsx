import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactRequestModal = ({ isOpen, onClose, initialProduct }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isOpen && initialProduct) {
            setFormData(prev => ({
                ...prev,
                message: `I am interested in requesting the ${initialProduct}.`
            }));
        } else if (!isOpen) {
            // Reset on close
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            setSuccessMessage('');
        }
    }, [isOpen, initialProduct]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/contact-requests', formData);
            setSuccessMessage('Thank you! Your request has been successfully submitted.');
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Error submitting contact request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeBtnStyle}>&times;</button>
                <h3 style={{ marginTop: 0, color: '#D3968C', textAlign: 'center', marginBottom: '20px' }}>
                    FOR SPECIAL REQUESTS & ORDERS
                </h3>
                
                {successMessage ? (
                    <div style={{ color: '#839958', textAlign: 'center', fontWeight: 'bold', padding: '20px' }}>
                        {successMessage}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>First Name</label>
                                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Last Name</label>
                                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Message</label>
                            <textarea required name="message" value={formData.message} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
                        </div>
                        <button type="submit" disabled={isSubmitting} style={submitBtnStyle}>
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const modalStyle = {
    backgroundColor: '#F7F4D5',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    position: 'relative'
};

const closeBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#0A3323'
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#0A3323',
    fontWeight: 'bold',
    fontSize: '0.9rem'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box'
};

const submitBtnStyle = {
    backgroundColor: '#D3968C',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px'
};

export default ContactRequestModal;
