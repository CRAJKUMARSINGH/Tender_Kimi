import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base URL from environment variables
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get token from localStorage if needed
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = 'An error occurred';

      if (typeof data === 'object' && data !== null && 'detail' in data) {
        errorMessage = (data as { detail: string }).detail;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }

      switch (status) {
        case 401:
          toast.error('Session expired. Please log in again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 413:
          toast.error('File size is too large. Please upload a smaller file.');
          break;
        case 422:
          // Validation error - handled by form validation
          break;
        case 500:
          toast.error('A server error occurred. Please try again later.');
          break;
        default:
          toast.error(errorMessage || 'An unexpected error occurred');
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
    } else {
      toast.error('An error occurred while setting up the request.');
    }

    return Promise.reject(error);
  }
);

// API methods
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const downloadTemplate = async (templateName: string) => {
  const response = await api.get(`/download/${templateName}`, {
    responseType: 'blob',
  });

  // Create a temporary URL for the blob
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', templateName);
  document.body.appendChild(link);
  link.click();

  // Clean up
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
