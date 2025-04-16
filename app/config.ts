// app/config.ts
const getApiBaseUrl = () => {
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

// Proper environment detection
const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ||
    process.env.NODE_ENV === 'development');

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment
};