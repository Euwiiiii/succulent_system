import axios from 'axios';

// Automatically detects if you are on localhost or Vercel
const isLocal = window.location.hostname === 'localhost';
const API_URL = isLocal ? 'http://localhost:5000/api' : '/_backend/api';

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (productData) => axios.post(`${API_URL}/products`, productData);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
