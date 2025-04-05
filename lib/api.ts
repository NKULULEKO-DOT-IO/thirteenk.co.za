// API base URL that respects the environment
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }

  // For production - always use HTTPS
  return 'https://thirteenkapi-service-227629318480.us-central1.run.app/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Define types for API responses
export interface ImageData {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  hd_url: string;
  downloads: number;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  file_size: number;
  content_type: string;
}

export interface ImagesResponse {
  images: ImageData[];
  total: number;
}

export interface DownloadResponse {
  download_url: string;
}

export interface DownloadCountResponse {
  total_downloads: number;
}

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching from: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for cross-origin requests
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// API functions for images
export async function getImages(
  skip = 0,
  limit = 20,
  tags?: string[],
  featured?: boolean
): Promise<ImagesResponse> {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (tags && tags.length > 0) {
    tags.forEach(tag => params.append('tags', tag));
  }

  if (featured !== undefined) {
    params.append('featured', featured.toString());
  }

  return fetchAPI<ImagesResponse>(`/images?${params.toString()}`);
}

export async function getImageById(id: string): Promise<ImageData> {
  return fetchAPI<ImageData>(`/images/${id}`);
}

// API functions for downloads
export async function downloadImage(imageId: string): Promise<DownloadResponse> {
  return fetchAPI<DownloadResponse>(`/downloads/${imageId}`, {
    method: 'POST',
  });
}

export async function getTotalDownloads(): Promise<DownloadCountResponse> {
  return fetchAPI<DownloadCountResponse>('/downloads/total');
}

export async function getImageDownloads(imageId: string): Promise<DownloadCountResponse> {
  return fetchAPI<DownloadCountResponse>(`/downloads/${imageId}/count`);
}