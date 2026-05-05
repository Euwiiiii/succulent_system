import axios from 'axios';

// Automatically detects if on localhost or Vercel
const isLocal = window.location.hostname === 'localhost';
const BASE_URL = isLocal ? 'http://localhost:5000/api' : '/_backend/api';
const API_URL = `${BASE_URL}/messages`;

const getHeaders = (user) => ({
    headers: {
        'x-user-id': user?._id,
        'x-user-role': user?.role
    }
});

const messageService = {
    // Send a new message
    sendMessage: async (user, data) => {
        const response = await axios.post(API_URL, data, getHeaders(user));
        return response.data;
    },

    // Get all conversations (Admin)
    getConversations: async (user) => {
        const response = await axios.get(`${API_URL}/conversations`, getHeaders(user));
        return response.data;
    },

    // Get conversation for a specific customer
    getCustomerConversation: async (user, customerId) => {
        const response = await axios.get(`${API_URL}/conversation/${customerId}`, getHeaders(user));
        return response.data;
    },

    // Get messages for a conversation
    getMessages: async (user, conversationId) => {
        const response = await axios.get(`${API_URL}/${conversationId}`, getHeaders(user));
        return response.data;
    },

    // Mark messages as read in a conversation
    markAsRead: async (user, conversationId) => {
        const response = await axios.put(`${API_URL}/mark-read`, {
            conversationId,
            userRole: user?.role
        }, getHeaders(user));
        return response.data;
    },

    // Update conversation status (Admin)
    updateStatus: async (user, conversationId, status, assignedAdminId) => {
        const response = await axios.put(`${API_URL}/conversation/${conversationId}/status`, {
            status,
            assignedAdminId
        }, getHeaders(user));
        return response.data;
    }
};

export default messageService;
