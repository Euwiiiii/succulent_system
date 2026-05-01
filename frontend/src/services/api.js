import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (productData) => axios.post(`${API_URL}/products`, productData);