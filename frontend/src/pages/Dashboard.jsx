import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminChat from '../components/AdminChat';

const Dashboard = () => {
    const [contactRequests, setContactRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contact-requests');
                setContactRequests(response.data);
            } catch (error) {
                console.error('Error fetching contact requests:', error);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ color: '#0A3323' }}>Seller Dashboard</h2>

            <div style={{ marginBottom: '30px' }}>
                <AdminChat />
            </div>

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ color: '#0A3323', borderBottom: '2px solid #0A3323', paddingBottom: '10px' }}>Special Requests & Leads</h3>
                {contactRequests.length === 0 ? (
                    <p style={{ color: '#666' }}>No special requests received yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#0A3323', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Contact</th>
                                <th style={{ padding: '15px' }}>Message</th>
                                <th style={{ padding: '15px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactRequests.map((req, index) => (
                                <tr key={req._id} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                    <td style={{ padding: '15px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{req.firstName} {req.lastName}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div>{req.email}</div>
                                        <div style={{ color: '#666', fontSize: '0.9em' }}>{req.phone}</div>
                                    </td>
                                    <td style={{ padding: '15px', maxWidth: '300px' }}>{req.message}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            padding: '5px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.85em',
                                            backgroundColor: req.status === 'Pending' ? '#fff3cd' : '#d4edda',
                                            color: req.status === 'Pending' ? '#856404' : '#155724',
                                            fontWeight: 'bold'
                                        }}>
                                            {req.status}
                                        </span>
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

export default Dashboard;
