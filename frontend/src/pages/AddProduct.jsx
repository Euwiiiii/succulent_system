import React, { useState } from 'react';
import { addProduct } from '../services/api'; 

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '', type: '', costPrice: '', sellingPrice: '', stockQuantity: '', imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // Validation: Prevent negative numbers
        if (type === 'number' && value < 0) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure fields to check them
        const { name, type, costPrice, sellingPrice, stockQuantity } = formData;

        // Check if any required field is empty 
        if (!name.trim() || !type.trim() || !costPrice || !sellingPrice || !stockQuantity) {
            alert("Please fill in all required plant details!");
            return; // Stop the submission
        }

        try {
            await addProduct(formData);
            alert(" Succulent added successfully!");
            // Reset form...
        } catch (error) {
            alert("Failed to add product.");
        }
    };
    return (
        <div style={{ 
            padding: '40px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
        }}>
            <h2 style={{ color: '#2d6a4f', fontWeight: 'bold' }}>ADD NEW SUCCULENTS</h2>
            
            <form onSubmit={handleSubmit} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%', 
                maxWidth: '400px', 
                gap: '15px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#AD9664'
            }}>
                <label style={{ color: '#2E311A', fontWeight: 'bold' }}>Plant Details</label>
                <input name="name" value={formData.name} placeholder="Name (e.g., Jade Plant)" onChange={handleChange} style={inputStyle} required />
                <input name="type" value={formData.type} placeholder="Type (e.g., Crassula)" onChange={handleChange} style={inputStyle} required />
                
                <label style={{ color: '#2E311A', fontWeight: 'bold' }}>Pricing & Stock</label>
                <input name="costPrice" value={formData.costPrice} type="number" placeholder="Cost Price (₱)" onChange={handleChange} style={inputStyle} required />
                <input name="sellingPrice" value={formData.sellingPrice} type="number" placeholder="Selling Price (₱)" onChange={handleChange} style={inputStyle} required />
                <input name="stockQuantity" value={formData.stockQuantity} type="number" placeholder="Initial Stock" onChange={handleChange} style={inputStyle} required />
                
                <input name="imageUrl" value={formData.imageUrl} placeholder="Image URL (Optional)" onChange={handleChange} style={inputStyle} />
                
                {/* Centered Button */}
                <button type="submit" style={{ 
                    padding: '12px 24px', 
                    cursor: 'pointer', 
                    backgroundColor: '#2d6a4f', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    alignSelf: 'center', 
                    transition: '0.2s'
                }}>
                    Save Succulents
                </button>
            </form>
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

export default AddProduct;