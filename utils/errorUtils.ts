import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api.types';

/**
 * Format API error responses into a consistent error object
 */
export const formatApiError = (error: unknown): Error => {
  // Already an Error object
  if (error instanceof Error && !(error instanceof AxiosError)) {
    return error;
  }

  // Axios error with response data
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;

    // Handle structured error responses
    if (data.detail) {
      return new Error(data.detail);
    }
    if (data.message) {
      return new Error(data.message);
    }
    if (data.errors && data.errors.length > 0) {
      const messages = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
      return new Error(messages);
    }

    // If response contains string data
    if (typeof data === 'string') {
      return new Error(data);
    }
  }

  // Network errors
  if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
    return new Error('Request timed out. Please check your internet connection and try again.');
  }

  if (error instanceof AxiosError && !error.response) {
    return new Error('Network error. Please check your internet connection and try again.');
  }

  // Status code specific messages
  if (error instanceof AxiosError && error.response) {
    switch (error.response.status) {
      case 401:
        return new Error('Authentication required. Please log in and try again.');
      case 403:
        return new Error('You don\'t have permission to access this resource.');
      case 404:
        return new Error('The requested resource was not found.');
      case 500:
      case 502:
      case 503:
      case 504:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(`Request failed with status: ${error.response.status}`);
    }
  }

  // Fallback for unknown errors
  return new Error('An unexpected error occurred');
};

/**
 * Creates a user-friendly error message from an API error
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const formattedError = formatApiError(error);
  return formattedError.message;
};

/**
 * Check if an error is a network-related error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response || error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Check if an error is a server error (5xx)
 */
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError && error.response) {
    return error.response.status >= 500 && error.response.status < 600;
  }
  return false;
};

/**
 * Check if an error is a client error (4xx)
 */
export const isClientError = (error: unknown): boolean => {
  if (error instanceof AxiosError && error.response) {
    return error.response.status >= 400 && error.response.status < 500;
  }
  return false;
};