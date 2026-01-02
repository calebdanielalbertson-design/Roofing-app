import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Supports Cloud Env
});

// Add mock Auth header for MVP
api.interceptors.request.use((config) => {
    config.headers['x-user-email'] = 'admin@demo.com';
    return config;
});
