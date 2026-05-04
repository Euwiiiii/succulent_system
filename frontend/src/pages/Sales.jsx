import React, { useState, useEffect } from 'react';
import { getSales } from '../services/api';
import { formatCurrency } from '../utils/calculator';

const Sales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const { data } = await getSales();
            setSales(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching sales", error);
        }
    };

    const totalRevenueAllTime = sales.reduce((sum, sale) => sum + (sale.totalRevenue || 0), 0);

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#2d6a4f', textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem', fontWeight: 'bold' }}>Sales Tracker</h2>
            
            <div style={{ backgroundColor: '#f8fffb', padding: '20px', borderRadius: '15px', border: '1px solid #2d6a4f', marginBottom: '30px', textAlign: 'center' }}>
                <h3 style={{ color: '#1b4332', margin: '0 0 10px 0' }}>Total Revenue (All Time)</h3>
                <h1 style={{ color: '#2d6a4f', margin: 0, fontSize: '3rem' }}>{formatCurrency(totalRevenueAllTime, true)}</h1>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2d6a4f', color: 'white' }}>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Product Name</th>
                        <th style={thStyle}>Qty Sold</th>
                        <th style={thStyle}>Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>No sales recorded yet. Start selling from the Inventory!</td>
                        </tr>
                    ) : (
                        sales.map(s => (
                            <tr key={s._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={tdStyle}>{new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString()}</td>
                                <td style={tdStyle}><strong>{s.productName}</strong></td>
                                <td style={tdStyle}>{s.quantitySold}</td>
                                <td style={tdStyle}><span style={{ color: '#2d6a4f', fontWeight: 'bold' }}>{formatCurrency(s.totalRevenue, true)}</span></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = { padding: '15px', textAlign: 'left' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default Sales;
