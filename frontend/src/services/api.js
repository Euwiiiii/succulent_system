import axios from 'axios';

// Automatically detects if you are on localhost or Vercel
const isLocal = window.location.hostname === 'localhost';
const API_URL = isLocal ? 'http://localhost:5000/api' : '/_backend/api';

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (productData) => axios.post(`${API_URL}/products`, productData);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

export const getSupplies = () => axios.get(`${API_URL}/supplies`);
export const addSupply = (supplyData) => axios.post(`${API_URL}/supplies`, supplyData);
export const updateSupply = (id, data) => axios.put(`${API_URL}/supplies/${id}`, data);
export const deleteSupply = (id) => axios.delete(`${API_URL}/supplies/${id}`);
