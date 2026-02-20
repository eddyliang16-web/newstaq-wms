import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) => api.post('/auth/login', { username, password });

// Clients
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);

// Products
export const getProducts = (client_id) => api.get('/products', { params: { client_id } });
export const createProduct = (data) => api.post('/products', data);

// Locations
export const getLocations = () => api.get('/locations');
export const getWarehouseZones = () => api.get('/warehouse-zones');

// Inventory
export const getInventory = (params) => api.get('/inventory', { params });

// Receipts
export const getReceipts = (params) => api.get('/receipts', { params });

// Orders
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);

// Inventory Counts
export const getInventoryCounts = () => api.get('/inventory-counts');

// Stock Movements
export const getStockMovements = (params) => api.get('/stock-movements', { params });

// Dashboard
export const getDashboardStats = (client_id) => api.get('/dashboard/stats', { params: { client_id } });

// Billing
export const getInvoices = (params) => api.get('/billing/invoices', { params });
export const getInvoice = (id) => api.get(`/billing/invoices/${id}`);

// Client Portal - CORRIGÉ : utilise /dashboard/stats au lieu de /client-portal/summary
export const getClientSummary = () => api.get('/dashboard/stats');

export default api;
