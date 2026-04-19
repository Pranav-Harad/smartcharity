const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error
        (error.message || 'Something went wrong');
    }
    return response.json();
};