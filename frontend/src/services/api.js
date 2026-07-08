import axios from 'axios';

const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || '/api/';
    console.log('🚀 Current API Base URL:', url);
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add JWT token and log requests
api.interceptors.request.use(
    (config) => {
        console.log('📡 Request:', config.method.toUpperCase(), config.baseURL.replace(/\/+$/, '') + config.url);
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh/expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('❌ Axios Error:', error.code, error.message, error.config?.url);
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Don't try to refresh if the failing request was login itself
            if (originalRequest.url?.includes('/auth/login/')) {
                return Promise.reject(error);
            }
            try {
                const response = await api.post('/auth/refresh/');
                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
