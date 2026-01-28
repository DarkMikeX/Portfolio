import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL
  || (process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null)
  || 'http://127.0.0.1:8000/api';
const ADMIN_TOKEN_KEY = 'admin_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
};
export const clearAuthToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

// Request interceptor: add Bearer token for dashboard
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 clear token and redirect to admin login
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && getAuthToken()) {
      clearAuthToken();
      if (window.location.hash !== '#admin-login') {
        window.location.hash = '#admin-login';
      }
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Bootstrap - one call for all home-page data (fast load). 10s timeout so UI can fall back to defaults.
export const getBootstrap = () => api.get('/bootstrap', { timeout: 10000 });

// Personal Info
export const getPersonalInfo = () => api.get('/personal-info');
export const updatePersonalInfo = (data) => api.put('/personal-info', data);

// Stats
export const getStats = () => api.get('/stats');
export const createStat = (data) => api.post('/stats', data);

// Services
export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Projects
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Products
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Testimonials
export const getTestimonials = () => api.get('/testimonials');
export const createTestimonial = (data) => api.post('/testimonials', data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

// Skills
export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data);

// Contact
export const sendContactMessage = (data) => api.post('/contact', data);
export const getContactMessages = () => api.get('/contact');

// Navigation Links
export const getNavLinks = () => api.get('/nav-links');
export const createNavLink = (data) => api.post('/nav-links', data);
export const deleteNavLink = (id) => api.delete(`/nav-links/${id}`);

// Cart & Checkout
export const createCart = (data) => api.post('/cart', data);
export const getCart = () => api.get('/cart');
export const updateCartItem = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const deleteCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

// Payment & Orders
export const createCheckoutSession = (data) => api.post('/checkout/create-session', data);
export const verifyRazorpayPayment = (data) => api.post('/checkout/verify-razorpay', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (orderId) => api.get(`/orders/${orderId}`);

// Admin auth
export const adminLogin = (data) => api.post('/auth/login', data);

// Dashboard (requires admin token)
export const getPaymentStats = () => api.get('/dashboard/stats');
export const getDashboardOrders = (params) => api.get('/dashboard/orders', { params });
export const getDashboardOrder = (orderId) => api.get(`/dashboard/orders/${orderId}`);
export const updateOrderStatus = (orderId, status) => api.put(`/dashboard/orders/${orderId}/status`, { status });

export default api;
