import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const fetchSneakers = (params) => API.get('/sneakers', { params });
export const fetchSneaker = (id) => API.get(`/sneakers/${id}`);
export const createSneaker = (data) => API.post('/sneakers', data);
export const updateSneaker = (id, data) => API.put(`/sneakers/${id}`, data);
export const deleteSneaker = (id) => API.delete(`/sneakers/${id}`);
export const fetchStats = () => API.get('/sneakers/stats');
export const triggerOracleSync = () => API.post('/oracle/sync');
export const fetchHealth = () => API.get('/health');

export default API;
