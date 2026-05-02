import axios from 'axios';

const API_URL = '/_backend/api';

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (productData) => axios.post(`${API_URL}/products`, productData);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
export const updateProduct = (id, updatedData) => axios.put(`${API_URL}/products/${id}`, updatedData);
