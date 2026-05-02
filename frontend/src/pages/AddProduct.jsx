import React, { useState } from 'react';
import { addProduct } from '../services/api'; 

const AddProduct = () => {
    
    const [formData, setFormData] = useState({
        name: '', type: 'Single Plant', 
        potCost: '', soilCost: '', laborCost: '', markupPercentage: '', 
        stockQuantity: '', imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'number' && value < 0) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (!formData.name.trim() || !formData.stockQuantity) {
            alert("⚠️ Please provide details in the required fields.");
            return;
        }

        
        const payload = {
            ...formData,
            totalCost: Number(formData.costPrice) || 0,
            sellingPrice: Number(formData.sellingPrice) || 0,
            potCost: 0, 
            soilCost: 0, 
            laborCost: 0, 
            markupPercentage: 0 
        };

        try {
            await addProduct(payload); 
            alert("Succulent added successfully!");
            // Reset form after success
            setFormData({ name: '', type: 'Single Plant', costPrice: '', sellingPrice: '', stockQuantity: '', imageUrl: '' });
        } catch (error) {
            console.error("Error adding product", error);
            alert("Failed to add product.");
        }
    };

    return (
        <div style={{ 
            padding: '40px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8fffb' 
        }}>
            <h2 style={{ color: '#2d6a4f', fontWeight: 'bold', marginBottom: '20px', fontSize: '2rem' }}>ADD NEW SUCCULENTS</h2>
            
            <form onSubmit={handleSubmit} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%', 
                maxWidth: '400px', 
                gap: '15px',
                padding: '30px',
                borderRadius: '15px',
                backgroundColor: '#2d6a4f', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <label style={{ color: '#d8f3dc', fontWeight: 'bold', fontSize: '0.9rem' }}>Plant Details</label>
                <input name="name" value={formData.name} placeholder="Name (e.g., Jade Plant)" onChange={handleChange} style={inputStyle} required />
                <input name="type" value={formData.type} placeholder="Type (e.g., Crassula)" onChange={handleChange} style={inputStyle} required />
                
                <label style={{ color: '#d8f3dc', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '10px' }}>Pricing Breakdown</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="potCost" value={formData.potCost} type="number" placeholder="Pot Cost (₱)" onChange={handleChange} style={inputStyle} required />
                    <input name="soilCost" value={formData.soilCost} type="number" placeholder="Soil Cost (₱)" onChange={handleChange} style={inputStyle} required />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="laborCost" value={formData.laborCost} type="number" placeholder="Labor (₱)" onChange={handleChange} style={inputStyle} required />
                    <input name="markupPercentage" value={formData.markupPercentage} type="number" placeholder="Margin (%)" onChange={handleChange} style={inputStyle} required />
                </div>
                
                
                <input name="stockQuantity" value={formData.stockQuantity} type="number" placeholder="Initial Stock" onChange={handleChange} style={inputStyle} required />
                
                <input name="imageUrl" value={formData.imageUrl} placeholder="e.g., https://image.com/plant.jpg" onChange={handleChange} style={inputStyle} required />
                
                <button type="submit" style={{ 
                    padding: '14px 24px', 
                    cursor: 'pointer', 
                    backgroundColor: '#d8f3dc', 
                    color: '#1b4332', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginTop: '20px',
                    width: '100%', 
                    transition: '0.3s'
                }}>
                    Save Succulents 
                </button>
            </form>
        </div>
    );
};

const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f8fffb',
    fontSize: '1rem'
};

export default AddProduct;