import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';
import type { ApiResponse, Guest, DashboardStats, GuestFormData, Property } from '../types';

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleApiError = (error: AxiosError): never => {
  if (error.code === 'ECONNABORTED') {
    throw new Error('Request timeout - please check your connection');
  }
  if (error.response) {
    const data = error.response.data as ApiResponse<any>;
    throw new Error(data.error?.message || 'An error occurred');
  }
  if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  }
  throw new Error(error.message || 'An unexpected error occurred');
};

// API Methods
export const guestApi = {
  // Get dashboard stats
  getStats: async (property: Property): Promise<DashboardStats> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>(
        `/guests/stats?property=${property}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to fetch stats');
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // Register new guest
  registerGuest: async (data: GuestFormData): Promise<Guest> => {
    try {
      const response = await api.post<ApiResponse<Guest>>('/guests', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error?.message || 'Registration failed');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const data = axiosError.response.data as ApiResponse<any>;
        if (data.error?.errors && data.error.errors.length > 0) {
          const errorMessages = data.error.errors
            .map(err => `${err.field}: ${err.message}`)
            .join('\n');
          throw new Error(`Validation failed:\n${errorMessages}`);
        }
      }
      throw handleApiError(axiosError);
    }
  },

  // Get guests list
  getGuests: async (property: Property, limit: number = 50): Promise<Guest[]> => {
    try {
      const response = await api.get<ApiResponse<{ data: Guest[] }>>(
        `/guests?property=${property}&limit=${limit}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data.data || [];
      }
      throw new Error('Failed to fetch guests');
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // Search guests
  searchGuests: async (property: Property, query: string): Promise<Guest[]> => {
    try {
      const response = await api.get<ApiResponse<{ data: Guest[] }>>(
        `/guests/search?q=${encodeURIComponent(query)}&property=${property}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data.data || [];
      }
      throw new Error('Search failed');
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // Checkout guest
  checkoutGuest: async (guestId: string): Promise<Guest> => {
    try {
      const response = await api.put<ApiResponse<Guest>>(`/guests/${guestId}`, {
        status: 'checked_out',
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Checkout failed');
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};
