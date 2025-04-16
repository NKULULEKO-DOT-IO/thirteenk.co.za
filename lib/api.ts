import axios, { AxiosRequestConfig } from 'axios';
import { ImageData, ImagesResponse, DownloadResponse, DownloadCountResponse } from '@/types/api.types';


// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // Server-side environment check
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://thirteenkapi-service-hii3wfspiq-uc.a.run.app/api/v1';
  }

  // Client-side environment check
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/v1';
  }

  // Production - always force HTTPS
  return 'https://thirteenkapi-service-hii3wfspiq-uc.a.run.app/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with consistent config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // Include cookies for CORS if needed
  maxRedirects: 5, // Handle redirects automatically
});


// Format error messages consistently
const formatApiError = (error: any): Error => {
  if (error.response?.data?.detail) {
    return new Error(error.response.data.detail);
  } else if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  } else if (error.message) {
    return new Error(error.message);
  }
  return new Error('An unexpected error occurred');
};


// API helper with better typing and error handling
const api = {
  // Get all images with optional filtering
  getImages: async (
    skip: number = 0,
    limit: number = 50
  ): Promise<ImagesResponse> => {
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });

      const queryString = params.toString();
      // Fixed: Properly append the query string to the endpoint
      const endpoint = `/images${queryString ? `?${queryString}` : ''}`;

      console.log(`Fetching images from: ${endpoint}`);
      const  response = await axiosInstance.get<ImagesResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch images:', error);
      // Return empty response instead of throwing to prevent UI crashes
      return { images: [], total: 0 };
    }
  },

  getDirectImages: async (): Promise<ImagesResponse> => {
    const endpoint = `/images`;
    const images = await axiosInstance.get<ImagesResponse>(endpoint); // Adjust limit as needed
    return images.data;
  },

  // Get popular locations (useful for location search suggestions)
  getPopularLocations: async (query?: string): Promise<string[]> => {
    try {
      const params = new URLSearchParams();

      if (query) {
        params.append('query', query);
      }

      const endpoint = `/locations/popular${query ? `?${params.toString()}` : ''}`;

      const response = await axiosInstance.get<{ locations: string[] }>(endpoint);
      return response.data.locations || [];
    } catch (error) {
      console.error('Failed to fetch popular locations:', error);
      return [];
    }
  },

  // Get available camera models based on make (for filtering)
  getCameraModels: async (make?: string): Promise<string[]> => {
    try {
      const params = new URLSearchParams();

      if (make) {
        params.append('make', make);
      }

      const endpoint = `/cameras/models${make ? `?${params.toString()}` : ''}`;

      const response = await axiosInstance.get<{ models: string[] }>(endpoint);
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to fetch camera models:', error);
      return [];
    }
  },

  // Get single image
  getImageById: async (id: string): Promise<ImageData> => {
    try {
      return await axiosInstance.get<ImageData, ImageData>(`/images/${id}`);
    } catch (error) {
      console.error(`Failed to fetch image ${id}:`, error);
      throw formatApiError(error);
    }
  },

  downloadImage: async (imageId: string): Promise<DownloadResponse> => {
    try {
      // Fixed: Extract data from the axios response
      const response = await axiosInstance.post<DownloadResponse>(`/downloads/${imageId}`);
      return response.data; // This was missing - we need to extract data from the axios response
    } catch (error) {
      console.error(`Failed to download image ${imageId}:`, error);
      throw formatApiError(error);
    }
  },

  // Get total downloads
  getTotalDownloads: async (): Promise<DownloadCountResponse> => {
    try {
      const response = await axiosInstance.get<DownloadCountResponse>('/downloads/total');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch total downloads:', error);
      // Return zero instead of throwing to prevent UI crashes
      return { total_downloads: 0 };
    }
  },

  // Get image-specific downloads
  getImageDownloads: async (imageId: string): Promise<DownloadCountResponse> => {
    try {
      return await axiosInstance.get<DownloadCountResponse, DownloadCountResponse>(`/downloads/${imageId}/count`);
    } catch (error) {
      console.error(`Failed to fetch downloads for image ${imageId}:`, error);
      // Return zero instead of throwing to prevent UI crashes
      return { total_downloads: 0 };
    }
  },

  // Generic request methods for future expansion
  get: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      return await axiosInstance.get<T, T>(url, config);
    } catch (error) {
      throw formatApiError(error);
    }
  },

  post: async <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      return await axiosInstance.post<T, T>(url, data, config);
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // File download helper
  downloadFile: async (url: string): Promise<Blob> => {
    try {
      const response = await axiosInstance.get<Blob, ArrayBuffer>(url, {
        responseType: 'blob',
        timeout: 30000, // Longer timeout for downloads
      });

      // Convert ArrayBuffer to Blob
      return new Blob([response], { type: 'application/octet-stream' });
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default api;

// Export the methods separately for more explicit imports
export const {
  getImages,
  getImageById,
  downloadImage,
  getTotalDownloads,
  getImageDownloads,
  getPopularLocations,
  getCameraModels,
  getDirectImages
} = api;