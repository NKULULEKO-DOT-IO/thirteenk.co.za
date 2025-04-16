// Device information types
export interface DeviceInfo {
  /**
   * Device type (mobile, tablet, desktop)
   */
  type?: string;

  /**
   * Browser name
   */
  browser?: string;

  /**
   * Browser version
   */
  browser_version?: string;

  /**
   * Operating system
   */
  os?: string;

  /**
   * OS version
   */
  os_version?: string;

  /**
   * Screen resolution
   */
  screen_resolution?: string;

  /**
   * Viewport size
   */
  viewport_size?: string;

  /**
   * Device pixel ratio
   */
  pixel_ratio?: number;
}

// Geographic location information
export interface GeoLocation {
  /**
   * Country code (ISO)
   */
  country_code?: string;

  /**
   * Country name
   */
  country_name?: string;

  /**
   * Region/state
   */
  region?: string;

  /**
   * City
   */
  city?: string;

  /**
   * Postal/zip code
   */
  postal_code?: string;

  /**
   * Latitude
   */
  latitude?: number;

  /**
   * Longitude
   */
  longitude?: number;

  /**
   * Timezone
   */
  timezone?: string;

  /**
   * Internet Service Provider
   */
  isp?: string;

  /**
   * Organization
   */
  org?: string;

  /**
   * AS number
   */
  as_number?: string;

  /**
   * AS organization
   */
  as_org?: string;
}

// Session information
export interface SessionInfo {
  /**
   * Unique session identifier
   */
  session_id?: string;

  /**
   * When the session started
   */
  session_start?: string;

  /**
   * Referrer URL
   */
  referrer_url?: string;

  /**
   * Landing page URL
   */
  landing_page?: string;

  /**
   * User agent string
   */
  user_agent?: string;

  /**
   * Previously viewed images in this session
   */
  previous_images?: string[];
}

// Enhanced download model
export interface EnhancedDownloadData {
  /**
   * Unique identifier for the download
   */
  id?: string;

  /**
   * ID of the downloaded image
   */
  image_id: string;

  /**
   * IP address of the user
   */
  ip_address?: string;

  /**
   * Device information
   */
  device?: DeviceInfo;

  /**
   * Geographic location information
   */
  geo?: GeoLocation;

  /**
   * Session information
   */
  session?: SessionInfo;

  /**
   * Requested format (if specified)
   */
  requested_format?: string;

  /**
   * Whether the download was successful
   */
  download_successful: boolean;

  /**
   * Time taken to download in milliseconds
   */
  download_time_ms?: number;

  /**
   * User ID (for authenticated users)
   */
  user_id?: string;

  /**
   * Timestamp of the download
   */
  timestamp: string;

  /**
   * Custom tracking data
   */
  custom_tracking?: Record<string, any>;
}

// Response from download initiation endpoint
export interface DownloadResponse {
  /**
   * URL where the file can be downloaded
   */
  download_url: string;
}

// Response for download count queries
export interface DownloadCountResponse {
  /**
   * Total number of downloads
   */
  total_downloads: number;
}

// Enhanced download hook result type
export interface UseDownloadResult {
  /**
   * Function to trigger the download of an image
   * @param imageId The ID of the image to download
   * @param trackingData Optional additional tracking data
   */
  downloadImage: (imageId: string, trackingData?: Record<string, any>) => Promise<void>;

  /**
   * Whether a download is currently in progress
   */
  isLoading: boolean;

  /**
   * Error if the download request failed
   */
  error: Error | null;

  /**
   * Last download data if available
   */
  lastDownload?: EnhancedDownloadData;
}

// Enhanced download stats options
export interface UseDownloadStatsOptions {
  /**
   * Whether to automatically fetch on mount
   */
  fetchOnMount?: boolean;

  /**
   * Polling interval in milliseconds (0 disables polling)
   */
  pollingInterval?: number;

  /**
   * Whether to include detailed analytics in the result
   */
  includeAnalytics?: boolean;
}
// Download analytics type that matches the backend API response structure
export interface DownloadAnalytics {
  /**
   * Total number of downloads
   */
  total_downloads?: number;

  /**
   * Number of unique users who downloaded
   */
  unique_users?: number;

  /**
   * Downloads by date
   */
  downloads_by_date?: Array<{
    date: string;
    count: number;
  }>;

  /**
   * Downloads by device type
   */
  downloads_by_device?: Array<{
    device_type: string;
    count: number;
  }>;

  /**
   * Downloads by country
   */
  downloads_by_country?: Array<{
    country_code: string;
    country_name: string;
    count: number;
  }>;

  /**
   * Downloads by browser
   */
  downloads_by_browser?: Array<{
    browser: string;
    count: number;
  }>;

  /**
   * Downloads by operating system
   */
  downloads_by_os?: Array<{
    os: string;
    count: number;
  }>;

  /**
   * Average download time in milliseconds
   */
  avg_download_time_ms?: number;
}

// Function to convert API response to frontend format if needed
export function formatAnalyticsData(apiData: DownloadAnalytics): {
  byDate: Array<{ date: string; count: number }>;
  byDevice: Array<{ device_type: string; count: number }>;
  byCountry: Array<{ country_code: string; country_name: string; count: number }>;
  byBrowser: Array<{ browser: string; count: number }>;
  byOS: Array<{ os: string; count: number }>;
  uniqueUsers: number;
  avgDownloadTimeMs: number;
} {
  return {
    byDate: apiData.downloads_by_date || [],
    byDevice: apiData.downloads_by_device || [],
    byCountry: apiData.downloads_by_country || [],
    byBrowser: apiData.downloads_by_browser || [],
    byOS: apiData.downloads_by_os || [],
    uniqueUsers: apiData.unique_users || 0,
    avgDownloadTimeMs: apiData.avg_download_time_ms || 0
  };
}

// Enhanced download stats result
export interface UseDownloadStatsResult {
  /**
   * Total number of downloads across all images
   */
  totalDownloads: number;

  /**
   * Whether stats are currently loading
   */
  isLoading: boolean;

  /**
   * Error if the fetch failed
   */
  error: Error | null;

  /**
   * Function to manually refetch download stats
   */
  refetch: () => Promise<void>;

  /**
   * Detailed analytics if requested
   */
  analytics?: DownloadAnalytics;
}