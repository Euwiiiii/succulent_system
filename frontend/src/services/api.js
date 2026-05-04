import axios from 'axios';

// Automatically detects if on localhost or Vercel
const isLocal = window.location.hostname === 'localhost';
const API_URL = isLocal ? 'http://localhost:5000/api' : '/_backend/api';

// Add the auth header to all requests
axios.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('succulent_user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.role) {
            config.headers['x-user-role'] = user.role;
        }
    }
    return config;
});

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (productData) => axios.post(`${API_URL}/products`, productData);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
export const quickSellProduct = (id) => axios.patch(`${API_URL}/products/${id}/sell`);

export const getSupplies = () => axios.get(`${API_URL}/supplies`);
export const addSupply = (supplyData) => axios.post(`${API_URL}/supplies`, supplyData);
export const updateSupply = (id, data) => axios.put(`${API_URL}/supplies/${id}`, data);
export const deleteSupply = (id) => axios.delete(`${API_URL}/supplies/${id}`);

export const getSales = () => axios.get(`${API_URL}/sales`);

// Auth
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);

// Requests
export const createRequest = (data) => axios.post(`${API_URL}/requests`, data);
export const getRequests = () => axios.get(`${API_URL}/requests`);
export const resolveRequest = (id) => axios.patch(`${API_URL}/requests/${id}/resolve`);
