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
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <h2 style={{ color: '#0A3323', textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', fontSize: '2.5rem' }}>MANAGE SUPPLIES</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', backgroundColor: 'white', borderRadius: '15px', border: '1px solid #0A3323', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={smallLabel}>Supply Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Premium Potting Mix" style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={smallLabel}>Supply Type</label>
                        <select name="type" value={formData.type} onChange={handleTypeChange} style={inputStyle}>
                            <option value="Soil">Soil</option>
                            <option value="Pot">Pot</option>
                            <option value="Fertilizer">Fertilizer</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={smallLabel}>Bulk Price (₱)</label>
                        <input name="bulkPrice" type="number" value={formData.bulkPrice} onChange={handleChange} placeholder="0.00" style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={smallLabel}>Shipping Fee (₱)</label>
                        <input name="shippingFee" type="number" value={formData.shippingFee} onChange={handleChange} placeholder="0.00" style={inputStyle} required />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        {formData.type === 'Pot' ? (
                            <>
                                <label style={smallLabel}>Quantity (pcs)</label>
                                <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="e.g., 50" style={inputStyle} required />
                            </>
                        ) : (
                            <>
                                <label style={smallLabel}>Total Weight (g)</label>
                                <input name="totalWeight" type="number" value={formData.totalWeight} onChange={handleChange} placeholder="e.g., 1000" style={inputStyle} required />
                            </>
                        )}
                    </div>
                </div>
                <button type="submit" style={btnStyle}>{editingId ? 'Update Supply' : 'Add Supply'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', type: 'Soil', bulkPrice: '', shippingFee: '', totalWeight: '', quantity: '' }); }} style={{ ...btnStyle, backgroundColor: '#D3968C' }}>Cancel Edit</button>}
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '15px', border: '1px solid #0A3323', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#0A3323', color: '#F7F4D5' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Stock</th>
                            <th style={thStyle}>Unit Cost</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplies.map((s, index) => (
                            <tr key={s._id} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? 'transparent' : '#f9f9f9' }}>
                                <td style={tdStyle}>{s.name}</td>
                                <td style={tdStyle}>{s.type}</td>
                                <td style={tdStyle}>{s.type === 'Pot' ? `${s.quantity} pcs` : `${s.totalWeight} g`}</td>
                                <td style={tdStyle}>₱{Number(s.unitCost || 0).toFixed(4)}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(s)} title="Edit" style={{ ...actionBtnStyle, color: '#105666' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(s._id, s.name)} title="Delete" style={{ ...actionBtnStyle, color: '#D3968C' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const inputStyle = { padding: '12px', flex: 1, borderRadius: '8px', border: '1px solid #0A3323', backgroundColor: '#F7F4D5', color: '#0A3323', outline: 'none', width: '100%', boxSizing: 'border-box' };
const smallLabel = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#0A3323', fontSize: '0.9rem' };
const btnStyle = { padding: '12px', backgroundColor: '#105666', color: '#F7F4D5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s' };
const thStyle = { padding: '15px', textAlign: 'left', fontWeight: 'bold' };
const tdStyle = { padding: '15px', textAlign: 'left', color: '#333' };
const actionBtnStyle = { cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', transition: 'opacity 0.2s' };

export default Supplies;
