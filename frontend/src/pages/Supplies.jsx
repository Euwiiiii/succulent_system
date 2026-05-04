import React, { useState, useEffect } from 'react';
import { getSupplies, addSupply, updateSupply, deleteSupply } from '../services/api';

const Supplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [formData, setFormData] = useState({ name: '', type: 'Soil', bulkPrice: '', shippingFee: '', totalWeight: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const { data } = await getSupplies();
            setSupplies(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching supplies", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        setFormData({ ...formData, type: e.target.value, totalWeight: '', quantity: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateSupply(editingId, formData);
                alert("Supply updated successfully!");
            } else {
                await addSupply(formData);
                alert("Supply added successfully!");
            }
            setFormData({ name: '', type: 'Soil', bulkPrice: '', shippingFee: '', totalWeight: '', quantity: '' });
            setEditingId(null);
            fetchSupplies();
        } catch (error) {
            console.error("Error saving supply", error);
            alert("Failed to save supply.");
        }
    };

    const handleEdit = (supply) => {
        setEditingId(supply._id);
        setFormData({
            name: supply.name || '',
            type: supply.type || 'Soil',
            bulkPrice: supply.bulkPrice || 0,
            shippingFee: supply.shippingFee || 0,
            totalWeight: supply.totalWeight || '',
            quantity: supply.quantity || ''
        });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await deleteSupply(id);
            fetchSupplies();
        } catch (error) {
            console.error("Error deleting", error);
            alert("Failed to delete.");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#2d6a4f', textAlign: 'center', marginBottom: '30px' }}>Manage Supplies</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#f8fffb', borderRadius: '10px', border: '1px solid #2d6a4f', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Supply Name" style={inputStyle} required />
                    <select name="type" value={formData.type} onChange={handleTypeChange} style={inputStyle}>
                        <option value="Soil">Soil</option>
                        <option value="Pot">Pot</option>
                        <option value="Fertilizer">Fertilizer</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="bulkPrice" type="number" value={formData.bulkPrice} onChange={handleChange} placeholder="Bulk Price (₱)" style={inputStyle} required />
                    <input name="shippingFee" type="number" value={formData.shippingFee} onChange={handleChange} placeholder="Shipping Fee (₱)" style={inputStyle} required />
                    
                    {formData.type === 'Pot' ? (
                        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" style={inputStyle} required />
                    ) : (
                        <input name="totalWeight" type="number" value={formData.totalWeight} onChange={handleChange} placeholder="Total Weight (g)" style={inputStyle} required />
                    )}
                </div>
                <button type="submit" style={btnStyle}>{editingId ? 'Update Supply' : 'Add Supply'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', type: 'Soil', bulkPrice: '', shippingFee: '', totalWeight: '', quantity: '' }); }} style={{...btnStyle, backgroundColor: 'gray'}}>Cancel Edit</button>}
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2d6a4f', color: 'white' }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Unit Cost</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {supplies.map(s => (
                        <tr key={s._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{s.name}</td>
                            <td style={tdStyle}>{s.type}</td>
                            <td style={tdStyle}>{s.type === 'Pot' ? `${s.quantity} pcs` : `${s.totalWeight} g`}</td>
                            <td style={tdStyle}>₱{Number(s.unitCost || 0).toFixed(4)}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleEdit(s)} style={{...actionBtnStyle, color: 'blue'}}>Edit</button>
                                <button onClick={() => handleDelete(s._id, s.name)} style={{...actionBtnStyle, color: 'red'}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const inputStyle = { padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px', textAlign: 'left' };
const actionBtnStyle = { margin: '0 5px', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' };

export default Supplies;
