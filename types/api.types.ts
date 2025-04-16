/**
 * Image data from the API
 */
export interface ImageData {
  id: string;
  name: string;
  description: string;
  filename: string;
  thumbnail_url: string;
  hd_url: string;
  file_size: number;
  content_type: string;
  downloads: number;
  tags: string[];
  created_at: string;
  updated_at?: string;
  is_featured: boolean;
}

/**
 * Response for image listing endpoint
 */
export interface ImagesResponse {
  images: ImageData[];
  total: number;
}

/**
 * Response for download initialization endpoint
 */
export interface DownloadResponse {
  download_url: string;
}

/**
 * Response for download count endpoints
 */
export interface DownloadCountResponse {
  total_downloads: number;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  /**
   * Whether to retry on failure
   */
  retry?: boolean;

  /**
   * Maximum number of retries
   */
  maxRetries?: number;

  /**
   * Timeout in milliseconds
   */
  timeout?: number;

  /**
   * Whether to show error toast notifications
   */
  showErrorToast?: boolean;
}