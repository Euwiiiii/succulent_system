import React, { useState, useEffect } from 'react';
import { getSales } from '../services/api';

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

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalRevenue || 0), 0);
    const totalCost = sales.reduce((sum, sale) => sum + ((sale.unitCostPrice || 0) * (sale.quantitySold || 0)), 0);
    const netProfit = totalRevenue - totalCost;

    const formatWholeCurrency = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.round(value));
    };

    const formatDecimalCurrency = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <h2 style={{ color: '#0A3323', textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold' }}>SALES TRACKER</h2>

            {/* Metric Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <span style={cardHeadingStyle}>Total Revenue</span>
                    <strong style={cardValueStyle}>{formatWholeCurrency(totalRevenue)}</strong>
                </div>
                <div style={cardStyle}>
                    <span style={cardHeadingStyle}>Total Cost</span>
                    <strong style={cardValueStyle}>{formatWholeCurrency(totalCost)}</strong>
                </div>
                <div style={cardStyle}>
                    <span style={cardHeadingStyle}>Net Profit</span>
                    <strong style={{ ...cardValueStyle, color: netProfit >= 0 ? '#F7F4D5' : '#D3968C' }}>{formatWholeCurrency(netProfit)}</strong>
                </div>
            </div>

            {/* Transaction Table */}
            <div style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid #105666', boxShadow: '0 8px 25px rgba(16, 86, 102, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#F7F4D5' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#105666', color: '#F7F4D5' }}>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Product Name</th>
                            <th style={thStyle}>Qty Sold</th>
                            <th style={thStyle}>Unit Cost</th>
                            <th style={thStyle}>Total Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#105666', fontWeight: 'bold' }}>No sales recorded yet.</td>
                            </tr>
                        ) : (
                            sales.map((s, index) => (
                                <tr key={s._id} style={{ borderBottom: index === sales.length - 1 ? 'none' : '1px solid #839958' }}>
                                    <td style={tdStyle}>{new Date(s.date).toLocaleDateString()}</td>
                                    <td style={tdStyle}><strong>{s.productName}</strong></td>
                                    <td style={tdStyle}>{s.quantitySold}</td>
                                    <td style={tdStyle}>{formatDecimalCurrency(s.unitCostPrice || 0)}</td>
                                    <td style={{ ...tdStyle, color: '#0A3323', fontWeight: 'bold' }}>{formatWholeCurrency(s.totalRevenue)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const cardStyle = {
    flex: 1, minWidth: '150px', padding: '2px 0', backgroundColor: '#0A3323',
    borderRadius: '12px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', gap: '2px',
    boxShadow: '0 4px 15px rgba(10, 51, 35, 0.2)', height: '80px'
};
const cardHeadingStyle = { color: '#839958', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 };
const cardValueStyle = { color: '#F7F4D5', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 };

const thStyle = { padding: '20px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #839958' };
const tdStyle = { padding: '20px', textAlign: 'left', color: '#105666' };

export default Sales;
