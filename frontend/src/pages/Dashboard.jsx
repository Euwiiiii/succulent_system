import React from 'react';
import AdminChat from '../components/AdminChat';

const Dashboard = () => {
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ color: '#2d6a4f' }}>Seller Dashboard</h2>

            <div style={{ marginBottom: '30px' }}>
                <AdminChat />
            </div>
        </div>
    );
};

export default Dashboard;
