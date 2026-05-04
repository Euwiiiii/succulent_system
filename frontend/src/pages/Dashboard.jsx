import React, { useState, useEffect } from 'react';
import { getRequests, resolveRequest } from '../services/api';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await getRequests();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    const handleResolve = async (id) => {
        try {
            await resolveRequest(id);
            fetchRequests(); // Refresh list
        } catch (error) {
            alert('Failed to resolve request.');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ color: '#2d6a4f' }}>Seller Dashboard</h2>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Customer Inquiries & Requests</h3>
                
                {requests.length === 0 ? (
                    <p style={{ color: 'gray' }}>No pending requests.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#2d6a4f', color: 'white' }}>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Customer</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Message</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{new Date(req.date).toLocaleDateString()}</td>
                                    <td style={tdStyle}><strong>{req.customerUsername}</strong></td>
                                    <td style={tdStyle}>{req.productName}</td>
                                    <td style={tdStyle}>{req.message}</td>
                                    <td style={tdStyle}>
                                        <span style={{ color: req.status === 'Resolved' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {req.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleResolve(req._id)} 
                                                style={{ padding: '5px 10px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px' };

export default Dashboard;
